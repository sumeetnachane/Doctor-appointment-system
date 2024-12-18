const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected ${mongoose.connection.host}`.bgRed.white); // host: local host ho raha ya server woh batayega
  } catch (error) {
    console.log(`MongoDB server issue ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
