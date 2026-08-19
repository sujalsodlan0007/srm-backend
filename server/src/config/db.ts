import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

let mongoMemoryServer: MongoMemoryServer | null = null;

const isPlaceholderMongoUri = (uri: string) => {
  try {
    const parsed = new URL(uri);
    return parsed.hostname === 'cluster0.mongodb.net';
  } catch {
    return false;
  }
};

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (env.MONGODB_URI) {
      if (isPlaceholderMongoUri(env.MONGODB_URI)) {
        console.warn(
          'MONGODB_URI uses the placeholder host cluster0.mongodb.net. Add your full MongoDB Atlas URI to backend/.env to use a persistent database.'
        );
      } else {
        await mongoose.connect(env.MONGODB_URI);
        console.log('MongoDB connected');
        return;
      }
    }
  } catch (error) {
    console.warn('Primary MongoDB connection failed. Falling back to in-memory database for this local run.', error);
  }

  if (!mongoMemoryServer) {
    mongoMemoryServer = await MongoMemoryServer.create();
  }

  const uri = mongoMemoryServer.getUri();
  await mongoose.connect(uri);
  console.log('MongoDB connected to in-memory server');
};
