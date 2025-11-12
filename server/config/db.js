const { MongoClient } = require("mongodb");

let db = null;
let client = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/jobtracker";
    
    // MongoDB connection options for production
    const options = {
      tls: true,
      tlsAllowInvalidCertificates: true,
      retryWrites: true,
      w: 'majority'
    };

    client = new MongoClient(uri, options);

    await client.connect();
    console.log("Connected to MongoDB!");
    
    db = client.db("jobtracker");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
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