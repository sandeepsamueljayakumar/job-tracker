const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env file!");
    console.log("Make sure you have created a .env file in the server folder");
    return;
  }

  console.log("🔄 Attempting to connect to MongoDB Atlas...");
  
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    // Test database access
    const db = client.db("jobtracker");
    const collections = await db.listCollections().toArray();
    console.log("📊 Current collections:", collections.map(c => c.name));

    // Test creating a collection
    const testCollection = db.collection("test");
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log("✅ Successfully wrote to database!");

    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log("🧹 Cleaned up test data");

  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\nTroubleshooting tips:");
    console.log("1. Check your MongoDB Atlas Network Access allows your IP");
    console.log("2. Verify your username and password are correct");
    console.log("3. Make sure your cluster is active (green status)");
  } finally {
    await client.close();
    console.log("👋 Connection closed");
  }
}

testConnection();