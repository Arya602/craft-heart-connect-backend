const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['admin', 'buyer'],
        bio: 'Administrator of Craft Heart Connect.',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    },
    {
        username: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['buyer'],
        bio: 'Love handcrafted items!',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    },
    {
        username: 'Jane Smith',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Passionate potter creating unique clay pieces inspired by nature.',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        sellerRequest: {
            status: 'approved',
            requestDate: new Date(),
        },
    },
    {
        username: 'Ravi Kumar',
        email: 'ravi@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Weaving stories into textiles. Specialist in traditional Indian prints.',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        sellerRequest: {
            status: 'approved',
            requestDate: new Date(),
        },
    },
    {
        username: 'Priya Sharma',
        email: 'priya@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Jewelry designer blending modern aesthetics with traditional techniques.',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        sellerRequest: {
            status: 'approved',
            requestDate: new Date(),
        },
    },
    {
        username: 'Amit Patel',
        email: 'amit@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Bringing folk art to life on canvas. Madhubani and Warli artist.',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        sellerRequest: {
            status: 'approved',
            requestDate: new Date(),
        },
    },
];

module.exports = users;
