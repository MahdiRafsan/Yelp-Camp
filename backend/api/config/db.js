const mongoose = require("mongoose");

const connectDB = async (dbURI) => {
  try {
    await mongoose.connect(dbURI);
  } catch (err) {
    console.error("Mongo connection error: ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
