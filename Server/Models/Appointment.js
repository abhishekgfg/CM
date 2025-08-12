const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId },
  patientName: { type: String },        // ✅ Store snapshot of name
  patientContact: { type: String },     // ✅ Store snapshot of contact
  date: String,
  time: String,
  notes: String,
  location: { type: String, required: true },
  message: { type: String },
  createdBy: { type: String, required: true },
  status: { type: String, default: "Scheduled" },
  paymentStatus: { type: String, enum: ["Paid", "Not Paid"], default: "Not Paid" },
  paymentDetails: { type: String },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
