import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('MongoDB connection string (MONGODB_URI) not found in environment variables.');
    process.exit(1); // Exit process with failure
  }

  try {
    await mongoose.connect(mongoURI);
    // Mongoose version 6+ no longer requires useNewUrlParser, useUnifiedTopology, etc.
    // options are generally not needed unless specific behaviors are required.
    // Example with options if needed for older versions or specific configs:
    // await mongoose.connect(mongoURI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   // useCreateIndex: true, // Not needed in Mongoose 6+
    //   // useFindAndModify: false, // Not needed in Mongoose 6+
    // });
    console.log('[database]: MongoDB connected successfully.');

    // Optional: Listen for Mongoose connection events
    mongoose.connection.on('error', (err) => {
      console.error(`[database]: MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('[database]: MongoDB disconnected.');
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error(`[database]: MongoDB connection failed: ${error.message}`);
    } else {
      console.error('[database]: MongoDB connection failed with an unknown error.');
    }
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
