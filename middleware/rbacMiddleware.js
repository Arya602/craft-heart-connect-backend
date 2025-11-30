const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!roles.includes(req.user.roles[0]) && !req.user.roles.includes('admin')) { // Simple check, assuming primary role or admin override
            return res.status(403).json({
                message: `User role ${req.user.roles} is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { authorize };
