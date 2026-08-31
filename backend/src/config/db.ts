import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let dbStorageType: 'Atlas' | 'Local' | 'Memory' = 'Atlas';
let isConnected = false;

export const getDbStorageType = () => dbStorageType;
export const isDbConnected = () => isConnected;

// Setup persistent connection event listeners
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log(`[MongoDB Connection] Active & Persistent.`);
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error(`[MongoDB Connection Error]`, err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn(`[MongoDB Connection Warning] Disconnected from database. Attempting auto-reconnect...`);
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log(`[MongoDB Connection] Auto-reconnected successfully.`);
});

export const connectDB = async (): Promise<void> => {
  const customURI = process.env.MONGODB_URI;

  if (customURI) {
    const maxRetries = 5;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const conn = await mongoose.connect(customURI, {
          serverSelectionTimeoutMS: 20000,
          connectTimeoutMS: 20000,
          socketTimeoutMS: 45000,
          maxPoolSize: 50,
          minPoolSize: 5,
          autoIndex: true,
        });

        // Ping database to guarantee active connection
        if (conn.connection.db) {
          await conn.connection.db.admin().ping();
        }

        dbStorageType = 'Atlas';
        isConnected = true;
        console.log(`[Database] Connected & verified successfully with MongoDB Atlas Cloud (PERSISTENT): ${conn.connection.host}`);
        return;
      } catch (err: any) {
        console.error(`[Database Connection Attempt ${attempt}/${maxRetries} Failed]: ${err.message}`);
        try {
          await mongoose.disconnect();
        } catch (_e) {}
        if (attempt < maxRetries) {
          console.log(`[Database] Retrying in 2 seconds...`);
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    console.error('[Database Critical] Could not connect to MongoDB Atlas after 5 attempts.');
  }

  // Fallback: Local persistent MongoDB (if installed locally)
  const localURI = 'mongodb://127.0.0.1:27017/aarambha_db';
  try {
    const conn = await mongoose.connect(localURI, { serverSelectionTimeoutMS: 2000 });
    dbStorageType = 'Local';
    isConnected = true;
    console.log(`[Database] Connected to Local Persistent MongoDB: ${conn.connection.host}`);
    return;
  } catch (_err) {
    console.warn(`[Database Alert] Local MongoDB not available on port 27017.`);
  }

  // Fallback for isolated CI/demo only
  if (process.env.ALLOW_MEMORY_DB === 'true') {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'aarambha_db' },
      });
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      dbStorageType = 'Memory';
      isConnected = true;
      console.warn(`[Database Alert] Running in temporary In-Memory RAM mode (ALLOW_MEMORY_DB=true). Data will reset on server restart!`);
    } catch (err: any) {
      console.error(`[Database Error] Could not start In-Memory MongoDB Engine: ${err.message}`);
    }
  } else {
    throw new Error(
      '[CRITICAL DATABASE ERROR] Could not establish a persistent connection to MongoDB Atlas. ' +
      'Please verify your internet connection and MongoDB Atlas IP access whitelist (allow 0.0.0.0/0).'
    );
  }
};
