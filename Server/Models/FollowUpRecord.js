const mongoose = require("mongoose");

const followUpRecordSchema = new mongoose.Schema(
  {
    courierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourierRecord",
      required: true,
    },
    followUpDate: {
      type: String,
      required: true,
    },
    followUpTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowUpRecord", followUpRecordSchema);
