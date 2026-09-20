const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: In MongoDB Atlas, go to "Network Access" -> "Add IP Address" -> click "Allow Access from Anywhere" (0.0.0.0/0).`);
    // Retry connection after 5 seconds instead of crashing the server
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
