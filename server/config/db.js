const { MongoClient } = require("mongodb");

let db = null;
let client = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    
    console.log("Attempting to connect to MongoDB...");
    console.log("URI format check:", uri.startsWith("mongodb+srv://") ? "Valid SRV format" : "Check URI format");
    
    // Simplified options for MongoDB Atlas
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    client = new MongoClient(uri, options);

    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    
    // Test the connection
    db = client.db("jobtracker");
    await db.admin().ping();
    console.log("✅ Database ping successful!");
    
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error; // Let server.js handle this
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB
};