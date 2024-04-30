// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://praganyamittal04:praganyamittal04@cluster0.zlml2gg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;