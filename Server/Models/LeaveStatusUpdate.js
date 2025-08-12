const mongoose = require("mongoose");

const leaveStatusUpdateSchema = new mongoose.Schema({
  leaveId: { type: mongoose.Schema.Types.ObjectId, ref: "Leave", required: true }, // reference original leave
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], required: true },
  message: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LeaveStatusUpdate", leaveStatusUpdateSchema);
