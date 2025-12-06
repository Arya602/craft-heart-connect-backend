const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const sampleProducts = [
    {
        name: 'Handwoven Cotton Throw Blanket',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500',
        images: [
            'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500'
        ],
        brand: 'Artisan Weaves',
        category: 'Home Decor',
        description: 'Beautiful handwoven cotton throw blanket with traditional patterns. Made using 100% organic cotton and natural dyes. Perfect for adding warmth and style to your living space.',
        price: 2499,
        countInStock: 15,
        isMadeToOrder: false,
        rating: 0,
        numReviews: 0,
        reviews: []
    },
    {
        name: 'Ceramic Tea Set - Blue Pottery',
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
        images: [
            'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500'
        ],
        brand: 'Clay Crafters',
        category: 'Pottery',
        description: 'Exquisite handcrafted ceramic tea set featuring traditional blue pottery designs. Includes teapot and 4 cups. Each piece is unique and food-safe.',
        price: 3999,
        countInStock: 8,
        isMadeToOrder: true,
        rating: 0,
        numReviews: 0,
        reviews: []
    },
    {
        name: 'Handmade Leather Journal',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
        images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
            'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500'
        ],
        brand: 'Leather & Lore',
        category: 'Stationery',
        description: 'Premium handcrafted leather journal with handmade paper. Features brass closure and 200 pages of acid-free paper. Perfect for writing, sketching, or journaling.',
        price: 1899,
        countInStock: 20,
        isMadeToOrder: false,
        rating: 0,
        numReviews: 0,
        reviews: []
    },
    {
        name: 'Wooden Wall Art - Mandala Design',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500',
        images: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500',
            'https://images.unsplash.com/photo-1582053433926-0b5e8e5a7d3d?w=500'
        ],
        brand: 'Wood & Wonder',
        category: 'Home Decor',
        description: 'Intricately carved wooden mandala wall art. Hand-carved from sustainable teak wood with natural finish. Diameter: 24 inches.',
        price: 4599,
        countInStock: 5,
        isMadeToOrder: true,
        rating: 0,
        numReviews: 0,
        reviews: []
    },
    {
        name: 'Hand-painted Silk Scarf',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500',
        images: [
            'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500',
            'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500'
        ],
        brand: 'Silk Stories',
        category: 'Fashion',
        description: 'Luxurious hand-painted silk scarf with vibrant floral patterns. Made from 100% pure mulberry silk. Each scarf is a unique piece of wearable art.',
        price: 3299,
        countInStock: 12,
        isMadeToOrder: false,
        rating: 0,
        numReviews: 0,
        reviews: []
    }
];

const addSampleProducts = async () => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: 'aryavr602@gmail.com' });

        if (!user) {
            console.error('❌ User with email aryavr602@gmail.com not found!');
            console.log('Please make sure this user exists in the database.');
            process.exit(1);
        }

        console.log(`✓ Found user: ${user.username} (${user.email})`);
        console.log(`✓ User ID: ${user._id}`);

        // Check if user has seller role
        if (!user.roles.includes('seller')) {
            console.log('⚠ User does not have seller role. Adding seller role...');
            user.roles.push('seller');
            await user.save();
            console.log('✓ Seller role added successfully!');
        } else {
            console.log('✓ User already has seller role');
        }

        // Delete existing products for this user
        const deletedCount = await Product.deleteMany({ user: user._id });
        console.log(`✓ Deleted ${deletedCount.deletedCount} existing products for this user.`);

        // Add user ID to each product
        const productsWithUser = sampleProducts.map(product => ({
            ...product,
            user: user._id
        }));

        // Insert products
        const createdProducts = await Product.insertMany(productsWithUser);
        console.log(`\n✅ Successfully added ${createdProducts.length} sample products!`);

        console.log('\n📦 Created products:');
        createdProducts.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name} - ₹${product.price} (Stock: ${product.countInStock})`);
        });

        console.log('\n✓ Done! You can now view these products in the seller dashboard.');
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

connectDB().then(() => {
    console.log('🔗 Connected to database');
    addSampleProducts();
});
