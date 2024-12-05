import mongoose from 'mongoose';

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!, {
    });
    console.log('Connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

export default connectDatabase;
