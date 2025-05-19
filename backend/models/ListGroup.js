const mongoose = require('mongoose');

const listGroupSchema = new mongoose.Schema({
  name: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ListGroup', listGroupSchema);
