const mongoose = require('mongoose');

const NurseSchema = new mongoose.Schema({
  name: { type: String},
  licenseNumber: { type: String },
  dob: { type: String},
  age: { type: String},
});

module.exports = mongoose.model('Nurse', NurseSchema);
