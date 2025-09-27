import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

export async function connectMongoDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export default mongoose;