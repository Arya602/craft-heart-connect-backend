
try {
    console.log('Loading mongoose...');
    require('mongoose');
    console.log('Loading dotenv...');
    require('dotenv').config();
    console.log('Loading colors...');
    require('colors');
    console.log('Loading users data...');
    require('./data/users');
    console.log('Loading products data...');
    require('./data/products');
    console.log('Loading User model...');
    require('./models/User');
    console.log('Loading Product model...');
    require('./models/Product');
    console.log('Loading Order model...');
    require('./models/Order');
    console.log('Loading Wishlist model...');
    require('./models/Wishlist');
    console.log('Loading db config...');
    require('./config/db');
    console.log('All imports successful');
} catch (e) {
    const fs = require('fs');
    fs.writeFileSync('test_error.log', e.toString());
    console.error('Error during import:', e);
}
