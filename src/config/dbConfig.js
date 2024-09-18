const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    const connect = await mongoose.connect(url, {
      // socketTimeoutMS: 1000,
      // serverSelectionTimeoutMS: 10000,
    });
    console.log(`mongodb connected ${connect.connection.host}`);
  } catch (error) {
    console.log("connection error", error);
  }
};

module.exports = { connectDB };
