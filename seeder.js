const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Wishlist = require('./models/Wishlist');
const connectDB = require('./config/db');

dotenv.config();
console.log('URI:', process.env.MONGODB_URI);



const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Wishlist.deleteMany();

        const createdUsers = await User.insertMany(users);

        const adminUser = createdUsers[0]._id;
        const seller1 = createdUsers[2]._id; // Ravi Kumar (Textiles)
        const seller2 = createdUsers[3]._id; // Jane Smith (Pottery)
        const seller3 = createdUsers[4]._id; // Mohan Lal (Woodwork)
        const seller4 = createdUsers[5]._id; // Priya Sharma (Jewelry)
        const seller5 = createdUsers[6]._id; // Amit Patel (Paintings)
        const seller6 = createdUsers[7]._id; // Suresh Gupta (Metalwork)

        const sampleProducts = products.map((product, index) => {
            let user = adminUser;
            if (index < 3) user = seller1;       // Textiles
            else if (index < 6) user = seller2;  // Pottery
            else if (index < 9) user = seller3;  // Woodwork
            else if (index < 12) user = seller4; // Jewelry
            else if (index < 15) user = seller5; // Paintings
            else if (index < 18) user = seller6; // Metalwork

            return { ...product, user };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        const fs = require('fs');
        fs.writeFileSync('seeder_error.log', error.toString());
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Wishlist.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

connectDB().then(() => {
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
});
