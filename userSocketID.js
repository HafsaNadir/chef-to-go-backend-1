const mongoose = require('mongoose');

const userSocketID = mongoose.Schema({
  userId: String,
  socketId: [],
  name: String,
  email: String
}, { timestamps: true });

module.exports = mongoose.model('userSocketID', userSocketID);