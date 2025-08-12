const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

exports.applyLeave = async (req, res) => {
  try {
    const { name, designation, date, fromDate, toDate, leaveReason } = req.body;

    if (!name || !designation || !date || !fromDate || !toDate || !leaveReason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Remove employee existence check by id since no id field now

    const leave = new Leave({ name, designation, date, fromDate, toDate, leaveReason, status: "Pending" });
    await leave.save();

    res.json({ message: "Leave applied successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying leave", error: err });
  }
};


