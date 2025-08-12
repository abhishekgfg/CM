const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
 
  name: { type: String, required: true },
  designation: { type: String, required: true },
  date: { type: String, required: true },
    fromDate: { type: String, required: true },  // Leave start date
  toDate: { type: String, required: true },    // Leave end date
  leaveReason: { type: String, required: true },
  status: { type: String, default: "Pending" }
});


module.exports = mongoose.model("Leave", leaveSchema);
