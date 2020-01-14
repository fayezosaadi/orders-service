const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost/treez";
const MONGODB_URI_TEST = "mongodb://localhost/treez-test";

class Mongo {
  static async connect() {
    await mongoose.connect(
      process.env.NODE_ENV === "test" ? MONGODB_URI_TEST : MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    );
  }
}

module.exports = { Mongo };
