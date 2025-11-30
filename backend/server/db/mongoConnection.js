import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

export async function connectMongoDB() {
  try {
    if (!MONGO_URI) {
      console.warn('⚠ MongoDB URI not configured. MongoDB features will be disabled.');
      return;
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ Connected to MongoDB successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    console.warn('⚠ Continuing without MongoDB. Chat history and crawl data features may not work.');
    // Don't exit - let the server continue without MongoDB
  }
}

export default mongoose;