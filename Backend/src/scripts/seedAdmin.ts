// scripts/seedAdmin.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Admin from '../models/Admin.model';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/padmasambhava-trips'
    );
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: 'admin@padmasambhavatrip.com',
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      process.exit(0);
    }

    // Create admin user
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@padmasambhavatrip.com',
      password: 'P@dm@2026',
      role: 'super-admin',
      isActive: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: P@dm@2026');
    console.log('👤 Name:', admin.name);
    console.log('🎭 Role:', admin.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();