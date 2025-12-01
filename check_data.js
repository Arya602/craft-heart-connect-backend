try {
    const users = require('./data/users');
    console.log('Users loaded successfully', users.length);
    const products = require('./data/products');
    console.log('Products loaded successfully', products.length);
} catch (error) {
    console.error('Error loading data:', error);
}
