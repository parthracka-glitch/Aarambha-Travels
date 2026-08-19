import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const customURI = process.env.MONGODB_URI;

  if (customURI) {
    try {
      const conn = await mongoose.connect(customURI, {
        serverSelectionTimeoutMS: 5000,
      });
      // Verify database responds
      if (conn.connection.db) {
        await conn.connection.db.admin().ping();
      }
      console.log(`[Database] Connected & verified successfully with MongoDB Atlas: ${conn.connection.host}`);
      return;
    } catch (err: any) {
      console.error(`[Database Warning] MongoDB Atlas returned error (${err.message}). Checking local/in-memory fallback...`);
      try {
        await mongoose.disconnect();
      } catch (_e) {}
    }
  }

  // Fallback 1: Local MongoDB
  const localURI = 'mongodb://127.0.0.1:27017/aarambha_db';
  try {
    const conn = await mongoose.connect(localURI, { serverSelectionTimeoutMS: 500 });
    console.log(`[Database] Connected to Local MongoDB: ${conn.connection.host}`);
    return;
  } catch (_err) {
    console.log(`[Database Info] Local MongoDB not running. Initializing In-Memory MongoDB Engine for Demo Mode...`);
  }

  // Fallback 2: MongoMemoryServer
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: { dbName: 'aarambha_db' },
    });
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[Database] In-Memory MongoDB Engine started successfully: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(`[Database Error] Could not start In-Memory MongoDB Engine: ${err.message}`);
  }
};
