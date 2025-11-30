require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    console.log('Testing MongoDB Connection...');
    console.log('URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!');
        console.log('Host:', mongoose.connection.host);
        console.log('Database Name:', mongoose.connection.name);

        // List collections to verify permissions
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.message.includes('bad auth')) {
            console.error('-> Check your username and password in MONGODB_URI.');
        } else if (error.message.includes('whitelist')) {
            console.error('-> Check your Network Access whitelist in MongoDB Atlas.');
        }
        process.exit(1);
    }
};

testConnection();
