// config/database.js
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("❌ No Mongo URI found. Check environment variable.");
    return;
  }

  // Masked URI for logs
  const masked = uri.replace(/:(.*?)@/, ":*****@");
  console.log("🔌 Connecting to:", masked);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
  }
}

module.exports = connectDB;
