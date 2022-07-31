require("dotenv").config();
const mongoose = require("mongoose");


const DB_URL = process.env.MONGO_URL || "mongodb://localhost/tfgdb"

const dbConnect = function () {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection error: "));
  return mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  });
};


module.exports = dbConnect;