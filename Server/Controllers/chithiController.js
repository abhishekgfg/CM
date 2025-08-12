const MedicineRecord = require("../Models/MedicineRecord");
const ChithiRecord = require("../Models/ChithiRecord");
const Account = require("../Models/Account");
const AssistantDoctor = require("../Models/AssistantDoctor");

exports.getAllChithiRecords = async (req, res) => {
  try {
    const medicineRecords = await MedicineRecord.find(
      { medicineStatus: "Medicine Ready" },
      {
        displayId: 1,
        patientName: 1,
        contact: 1,
        date: 1,
        time: 1,
        location: 1,
        paymentStatus: 1,
        details: 1,
        medicineExplain: 1,
        nextFollowUp: 1,
        referenceNumber: 1,
        action: 1,
        medicineStatus: 1,
      }
    ).sort({ createdAt: -1 });

    const chithiRecords = await ChithiRecord.find();
    const accounts = await Account.find({}, { _id: 1, assistantId: 1 });
    const assistantDoctors = await AssistantDoctor.find();

    const combined = medicineRecords.map((rec) => {
      const chithi = chithiRecords.find((r) => r.accountId.toString() === rec._id.toString());

      const account = accounts.find((a) => a._id.toString() === rec._id.toString());
      const assistant = assistantDoctors.find(
        (doc) => account?.assistantId?.toString() === doc._id.toString()
      );

      return {
        ...rec.toObject(),

        // 🟢 Prioritize field source: ChithiRecord > MedicineRecord > AssistantDoctor
        details: chithi?.details || rec.details || assistant?.details || "",
        medicineExplain:
          chithi?.medicineExplain || rec.medicineExplain || assistant?.medicineExplain || "",
        nextFollowUp:
          chithi?.nextFollowUp || rec.nextFollowUp || assistant?.nextFollowUp || "",
        referenceNumber: chithi?.referenceNumber || rec.referenceNumber || "",
        action: chithi?.action || rec.action || assistant?.action || "",
        chithiStatus: chithi?.chithiStatus || "In Progress",
      };
    });

    res.status(200).json(combined);
  } catch (err) {
    console.error("Error fetching chithi records:", err);
    res.status(500).json({ error: "Failed to fetch chithi records" });
  }
};


// ✅ POST (Save or Update) chithi record
exports.saveChithiRecord = async (req, res) => {
  try {
    const {
      accountId,
      displayId,
      patientName,
      contact,
      date,
      time,
      location,
      paymentStatus,
      details,
      medicineExplain,
      nextFollowUp,
      referenceNumber,
      action,
      chithiStatus,
    } = req.body;

    const existing = await ChithiRecord.findOne({ accountId });

    if (existing) {
      Object.assign(existing, {
        displayId,
        patientName,
        contact,
        date,
        time,
        location,
        paymentStatus,
        details,
        medicineExplain,
        nextFollowUp,
        referenceNumber,
        action,
        chithiStatus,
      });
      await existing.save();
    } else {
      await ChithiRecord.create({
        accountId,
        displayId,
        patientName,
        contact,
        date,
        time,
        location,
        paymentStatus,
        details,
        medicineExplain,
        nextFollowUp,
        referenceNumber,
        action,
        chithiStatus,
      });
    }

    res.status(200).json({ message: "Chithi record saved." });
  } catch (err) {
    console.error("Error saving chithi record:", err);
    res.status(500).json({ error: "Save failed" });
  }
};
