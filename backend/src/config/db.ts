import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const customURI = process.env.MONGODB_URI;

  if (customURI) {
    const isProduction = process.env.NODE_ENV === 'production';
    const maxRetries = isProduction ? 3 : 1;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const conn = await mongoose.connect(customURI, {
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          maxPoolSize: 25,
          minPoolSize: 2,
        });
        // Verify database responds
        if (conn.connection.db) {
          await conn.connection.db.admin().ping();
        }
        console.log(`[Database] Connected & verified successfully with MongoDB Atlas: ${conn.connection.host}`);
        return;
      } catch (err: any) {
        console.error(`[Database Warning] Attempt ${attempt}/${maxRetries} to connect to MongoDB Atlas failed (${err.message}).`);
        try {
          await mongoose.disconnect();
        } catch (_e) {}
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    if (isProduction) {
      console.error('[Database Critical] Could not connect to MongoDB Atlas in production mode. Please check MONGODB_URI & Atlas IP Whitelist (allow 0.0.0.0/0 on Render).');
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
