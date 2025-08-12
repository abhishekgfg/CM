  const mongoose = require("mongoose");

  const attendanceSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Employee ID
    name: { type: String, required: true },
    designation: { type: String, required: true },
    entryTime: { type: String, default: "" },
    status: { type: String, default: "Present" },
    date: { type: String, required: true } // YYYY-MM-DD format
  });

  attendanceSchema.index({ id: 1, date: 1 }, { unique: true });

  module.exports = mongoose.model("Attendance", attendanceSchema);
