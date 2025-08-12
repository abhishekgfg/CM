const CourierRecord = require("../Models/CourierRecord");
const FollowUpRecord = require("../Models/FollowUpRecord");

// GET with join from both models
exports.getFollowUpRecords = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const courierQuery = {
      courierStatus: "Courier Done",
      $or: [
        { patientName: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { displayId: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { trackingId: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } },
        { date: { $regex: search, $options: "i" } }, // optional base date field
      ],
    };

    const courierRecords = await CourierRecord.find(courierQuery).lean();

    const courierIds = courierRecords.map((rec) => rec._id);
    const followUps = await FollowUpRecord.find({
      courierId: { $in: courierIds },
      $or: [
        { followUpDate: { $regex: search, $options: "i" } },
        { followUpTime: { $regex: search, $options: "i" } },
      ],
    }).lean();

    const followUpMap = {};
    followUps.forEach((fu) => {
      followUpMap[fu.courierId] = {
        followUpDate: fu.followUpDate,
        followUpTime: fu.followUpTime,
      };
    });

    const merged = courierRecords.map((rec) => ({
      ...rec,
      followUpDate: followUpMap[rec._id]?.followUpDate || "",
      followUpTime: followUpMap[rec._id]?.followUpTime || "",
    }));

    // Filter again in case follow-up matched but courier didn't
    const filtered = merged.filter((rec) =>
      JSON.stringify(rec).toLowerCase().includes(search.toLowerCase())
    );

    res.status(200).json(filtered);
  } catch (err) {
    console.error("Error fetching follow-up records:", err);
    res.status(500).json({ error: "Failed to fetch follow-up data" });
  }
};

// Save follow-up data
exports.markFollowUpDone = async (req, res) => {
  try {
    const { recordId, followUpDate, followUpTime } = req.body;

    const existing = await FollowUpRecord.findOne({ courierId: recordId });

    if (existing) {
      await FollowUpRecord.findByIdAndUpdate(existing._id, {
        followUpDate,
        followUpTime,
      });
    } else {
      await FollowUpRecord.create({
        courierId: recordId,
        followUpDate,
        followUpTime,
      });
    }

    res.status(200).json({ message: "Follow-up saved." });
  } catch (err) {
    console.error("Error saving follow-up:", err);
    res.status(500).json({ error: "Failed to save follow-up." });
  }
};
