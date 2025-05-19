const mongoose = require('mongoose');

// Define schema for distributed lists
const listSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Track admin who uploaded list
  listGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'ListGroup', required: true }, // Reference to ListGroup
});

module.exports = mongoose.model('List', listSchema);
