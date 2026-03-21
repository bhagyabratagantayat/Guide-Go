const mongoose = require('mongoose');
const User = require('../models/User');
const Guide = require('../models/Guide');
const config = require('../config/env');

const setupAdminAndApproveGuides = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');

        // 1. Create a Primary Admin Account
        const adminEmail = 'admin@guidego.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            await User.create({
                name: 'GuideGo Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin',
                isVerified: true,
                mobile: '9999999999'
            });
            console.log(`Admin account created: ${adminEmail} / password123`);
        } else {
            console.log(`Admin account already exists: ${adminEmail}`);
        }

        // 2. Approve all pending guides
        const result = await Guide.updateMany(
            { status: 'pending' },
            { $set: { status: 'approved' } }
        );
        
        console.log(`Updated ${result.modifiedCount} guides to 'approved' status.`);

        console.log('✅ Setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
};

setupAdminAndApproveGuides();
