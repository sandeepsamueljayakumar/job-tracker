const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB, getDB } = require("./config/db");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// CORS headers (without using cors package)
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://job-tracker-frontend.onrender.com',
    'https://jobtracker-frontend.onrender.com',
    process.env.CLIENT_URL
  ].filter(Boolean); // Remove undefined values
  
  const origin = req.headers.origin;
  
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    } else {
      res.header("Access-Control-Allow-Origin", "*");
    }
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// API Routes - THESE COME FIRST
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/interviews", require("./routes/interviews"));

// Health check endpoint with database check
app.get("/health", async (req, res) => {
  const healthStatus = {
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: "Unknown"
  };

  try {
    const database = getDB();
    await database.admin().ping();
    healthStatus.database = "Connected";
    res.status(200).json(healthStatus);
  } catch (error) {
    healthStatus.database = "Disconnected";
    healthStatus.dbError = error.message;
    console.error("Health check - DB error:", error.message);
    res.status(200).json(healthStatus);
  }
});

// Test database connection endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    const database = getDB();
    
    // Try to ping the database
    await database.admin().ping();
    
    // Try to list collections
    const collections = await database.listCollections().toArray();
    
    res.json({
      status: "success",
      message: "Database connection successful",
      database: database.databaseName,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database test error:", error);
    res.status(503).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root API endpoint - ONLY in development
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.json({ 
      message: "JobTracker API Server",
      status: "Running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        jobs: "/api/jobs",
        interviews: "/api/interviews",
        health: "/health",
        testDb: "/api/test-db"
      }
    });
  });
}

// Serve static files in production - THIS MUST BE LAST before error handlers
if (process.env.NODE_ENV === "production") {
  const fs = require("fs");
  
  // Render's structure: /opt/render/project/src/server -> /opt/render/project/src/client/build
  // So we only need to go up ONE level from server to reach client
  const clientBuildPath = path.join(__dirname, "../client/build");
  
  console.log("Production mode - Looking for client build...");
  console.log("Expected path:", clientBuildPath);
  console.log("Current directory:", __dirname);
  
  if (fs.existsSync(clientBuildPath)) {
    console.log("✅ Client build directory found!");
    
    // Serve static files from React build
    app.use(express.static(clientBuildPath));
    
    // Handle React routing - return all requests to React app
    // This MUST be after all API routes
    app.get("*", (req, res) => {
      const indexPath = path.join(clientBuildPath, "index.html");
      console.log(`Serving React app for route: ${req.path}`);
      
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error("index.html not found at:", indexPath);
        res.status(404).json({ 
          error: "Application build not found",
          message: "The React application build files are missing."
        });
      }
    });
  } else {
    console.error("❌ Client build directory NOT found!");
    console.log("Build process may have failed or path is incorrect.");
    
    // Check alternative possible paths
    const alternativePaths = [
      path.join(__dirname, "../../client/build"),
      path.join(__dirname, "./build"),
      path.join(__dirname, "../build"),
      "/opt/render/project/src/client/build"
    ];
    
    console.log("Checking alternative paths:");
    alternativePaths.forEach(altPath => {
      if (fs.existsSync(altPath)) {
        console.log(`✅ Found build at alternative path: ${altPath}`);
        console.log("   Consider updating the clientBuildPath to use this path!");
      } else {
        console.log(`❌ Not found: ${altPath}`);
      }
    });
    
    // Fallback to API-only mode
    app.get("/", (req, res) => {
      res.json({ 
        message: "JobTracker API Server",
        status: "Running (Frontend not found)",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        error: "React build not found - API only mode",
        endpoints: {
          jobs: "/api/jobs",
          interviews: "/api/interviews",
          health: "/health",
          testDb: "/api/test-db"
        }
      });
    });
  }
}

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error middleware:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
    timestamp: new Date().toISOString()
  });
});

// Start server function
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error("WARNING: MONGODB_URI not found in environment variables!");
      console.log("Server will start but database operations will fail.");
    } else {
      console.log("MONGODB_URI found in environment");
    }
    
    // Try to connect to database
    console.log("Attempting to connect to MongoDB...");
    await connectDB();
    console.log("✅ Database connected successfully!");
    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("Server will start anyway, but database operations will fail.");
  }
  
  // Start the server regardless of database connection
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: ${process.env.NODE_ENV === 'production' ? 'https://job-tracker-xgcm.onrender.com' : `http://localhost:${PORT}`}`);
    console.log("\n📋 Available endpoints:");
    console.log("  - GET  /health");
    console.log("  - GET  /api/test-db");
    console.log("  - GET  /api/jobs");
    console.log("  - POST /api/jobs");
    console.log("  - GET  /api/interviews");
    console.log("  - POST /api/interviews");
    
    if (process.env.NODE_ENV !== 'production') {
      console.log("  - GET  / (API info)");
    } else {
      console.log("  - GET  /* (React app)");
    }
  });
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled Promise Rejection:', err);
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err);
  // Don't exit for database issues
  if (!err.message.includes('MongoDB') && !err.message.includes('database')) {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  const { closeDB } = require("./config/db");
  await closeDB();
  process.exit(0);
});