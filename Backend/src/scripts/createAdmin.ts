// src/scripts/createAdmin.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Admin from '../models/Admin.model';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || '';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('📦 Collection will be: admins');
    console.log('');

    // Check if admin exists
    const existing = await Admin.findOne({ email: 'admin@padmasambhavatrip.com' });
    
    if (existing) {
      console.log('⚠️  Admin already exists!');
      console.log('Updating password...');
      
      existing.password = 'P@dm@2026';
      await existing.save();
      
      console.log('✅ Password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      
      const newAdmin = await Admin.create({
        name: 'Admin User',
        email: 'admin@padmasambhavatrip.com',
        password: 'P@dm@2026',
        role: 'super-admin',
        isActive: true,
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('ID:', newAdmin._id);
    }

    console.log('');
    console.log('=================================');
    console.log('📧 Email: admin@padmasambhavatrip.com');
    console.log('🔑 Password: P@dm@2026');
    console.log('🎭 Role: super-admin');
    console.log('=================================');
    console.log('');
    console.log('✅ You can now login!');
    console.log('');
    
    // Verify it was created
    const count = await Admin.countDocuments();
    console.log(`📊 Total admins in database: ${count}`);
    
    await mongoose.connection.close();
    console.log('');
    console.log('✅ Done! Check MongoDB Atlas now.');
    process.exit(0);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error:', error);
    process.exit(1);
  }
}

createAdmin();