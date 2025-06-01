const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Replace the placeholder with your actual password and database name
        const uri = process.env.MONGODB_URI ;

        await mongoose.connect(uri);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;