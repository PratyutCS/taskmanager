const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Check if demo user exists
        const userExists = await User.findOne({ email: 'demo@example.com' });

        if (userExists) {
            console.log('Demo user already exists');
            process.exit();
        }

        const user = new User({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123', // Will be hashed by pre-save hook
        });

        await user.save();

        console.log('Demo user created successfully');
        console.log('Email: demo@example.com');
        console.log('Password: password123');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
