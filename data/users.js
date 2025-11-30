const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['admin', 'buyer'],
    },
    {
        username: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['buyer'],
    },
    {
        username: 'Jane Smith',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
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
        sellerRequest: {
            status: 'approved',
            requestDate: new Date(),
        },
    },
];

module.exports = users;
