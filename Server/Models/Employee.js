// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true }
});

module.exports = mongoose.model("Employee", employeeSchema);
