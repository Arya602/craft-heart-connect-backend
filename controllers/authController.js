const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Generate Access Token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Short lived
    });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
        expiresIn: '7d', // Long lived
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        // Send welcome email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Craft Heart Connect!',
                message: `Hi ${user.username}, welcome to the community!`,
            });
        } catch (error) {
            console.error('Email send failed', error);
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token to DB
        user.refreshToken = [refreshToken];
        await user.save();

        // Send refresh token in cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None', // Required for cross-site cookie (Vercel -> Render)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            accessToken,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token to DB (append to array for multi-device)
        let newRefreshTokenArray = !user.refreshToken ? [] : user.refreshToken;
        newRefreshTokenArray = [...newRefreshTokenArray, refreshToken];
        user.refreshToken = newRefreshTokenArray;
        await user.save();

        // Send refresh token in cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            accessToken,
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Refresh Access Token
// @route   GET /api/auth/refresh
// @access  Public (Cookie)
const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const user = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!user) {
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); // Forbidden
                // Hack: Delete all refresh tokens for the hacked user
                const hackedUser = await User.findById(decoded.id).exec();
                if (hackedUser) {
                    hackedUser.refreshToken = [];
                    await hackedUser.save();
                }
            }
        );
        return res.sendStatus(403); // Forbidden
    }

    const newRefreshTokenArray = user.refreshToken.filter(rt => rt !== refreshToken);

    // Evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        async (err, decoded) => {
            if (err) {
                user.refreshToken = [...newRefreshTokenArray];
                await user.save();
            }
            if (err || user.id !== decoded.id) return res.sendStatus(403);

            // Refresh token was still valid
            const accessToken = generateAccessToken(user.id);
            const newRefreshToken = generateRefreshToken(user.id);

            user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await user.save();

            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({ accessToken });
        }
    );
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
    await user.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    refresh,
    logoutUser
};
