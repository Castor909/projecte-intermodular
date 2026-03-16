const mongoose = require('mongoose');

async function connectDatabase(connectionString) {
  if (!connectionString) {
    throw new Error('MONGO_URI is not defined');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 5000,
  });
}

module.exports = {
  connectDatabase,
};