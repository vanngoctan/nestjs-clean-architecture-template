#!/usr/bin/env node
/**
 * This script creates the initial MongoDB database collections if they don't exist
 * Usage:
 *   npm run db:setup:mongodb
 */
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function setupMongoDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs_clean_arch';
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Create users collection if it doesn't exist
    const collections = await db.listCollections({ name: 'users' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('users');
      console.log('Created users collection');
      
      // Create a unique index on email field
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('Created unique index on users.email');
    } else {
      console.log('Users collection already exists');
    }
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
  } finally {
    await client.close();
  }
}

setupMongoDatabase();
