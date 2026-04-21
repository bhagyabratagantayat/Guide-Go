const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@guidego.com';
        const existing = await User.findOne({ email: adminEmail });
        
        if (existing) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            phone: '0000000000',
            provider: 'local',
            profileComplete: true,
            isVerified: true
        });

        console.log('✅ Admin user created successfully');
        console.log('Email: admin@guidego.com');
        console.log('Pass: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
