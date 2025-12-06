const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const users = require('./data/users');
const products = require('./data/products');
const reportsData = require('./data/reports');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Wishlist = require('./models/Wishlist');
const Report = require('./models/Report');
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
        const seller7 = createdUsers[8]._id; // Arya Verma (Your Account)

        const sampleProducts = products.map((product, index) => {
            let user = adminUser;
            if (index < 3) user = seller1;       // Textiles
            else if (index < 6) user = seller2;  // Pottery
            else if (index < 9) user = seller3;  // Woodwork
            else if (index < 12) user = seller4; // Jewelry
            else if (index < 15) user = seller5; // Paintings
            else if (index < 18) user = seller6; // Metalwork
            else if (index < 23) user = seller7; // Arya Verma's products

            return { ...product, user };
        });

        const createdProducts = await Product.insertMany(sampleProducts);

        // Create reports with proper linking
        const buyer = createdUsers[1]._id; // John Doe
        const sampleReports = reportsData.map((report, index) => {
            let reporter = buyer;
            let reportedEntity;

            if (report.entityType === 'Product') {
                // Report different products
                reportedEntity = createdProducts[index % createdProducts.length]._id;
            } else {
                // Report different sellers
                const sellerIndex = 2 + (index % 6); // Sellers are at indices 2-7
                reportedEntity = createdUsers[sellerIndex]._id;
            }

            return {
                ...report,
                reporter,
                reportedEntity,
                actionTakenBy: report.actionTaken ? adminUser : null,
                actionTakenAt: report.actionTaken ? new Date() : null,
            };
        });

        await Report.insertMany(sampleReports);

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
        await Report.deleteMany();

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
