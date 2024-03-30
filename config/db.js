const mongoose = require('mongoose');

const connectDB = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${db.connection.host.yellow}`.cyan.underline.bold)
}

module.exports = connectDB;