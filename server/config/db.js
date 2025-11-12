const { MongoClient } = require("mongodb");

let db = null;
let client = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/jobtracker";
    
    // For production, use less strict SSL settings
    const options = process.env.NODE_ENV === 'production' 
      ? {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          tls: true,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true,
        }
      : {};

    client = new MongoClient(uri, options);

    await client.connect();
    console.log("Connected to MongoDB!");
    
    db = client.db("jobtracker");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't throw in production, just log
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
    // Try to reconnect after 5 seconds
    setTimeout(() => connectDB(), 5000);
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