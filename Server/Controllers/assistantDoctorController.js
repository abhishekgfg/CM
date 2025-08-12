const Appointment = require("../Models/Appointment");
const AssistantDoctor = require("../Models/AssistantDoctor");
const Patient = require("../Models/Patient");
const GooglePatient = require("../Models/GooglePatientModel");

exports.getConfirmedAppointments = async (req, res) => {
  try {
    // Fetch confirmed appointments
    const appointments = await Appointment.find({ status: "confirmed" });

    // Fetch all assistant records
    const records = await AssistantDoctor.find();

    // Map appointmentId => assistant record
    const paymentMap = {};
    for (const record of records) {
      paymentMap[record.appointmentId] = record;
    }

    // Merge assistant data + populate patient data
    const merged = await Promise.all(
      appointments.map(async (appt) => {
        let patient = await Patient.findById(appt.patientId);
        if (!patient) {
          patient = await GooglePatient.findById(appt.patientId);
        }

        const payment = paymentMap[appt._id] || {};

        return {
          ...appt.toObject(),
          patientId: {
            _id: appt.patientId,
            name: patient?.name || appt.patientName || "N/A",
            contact: patient?.contact || appt.patientContact || "N/A",
          },
          paymentStatus: payment.status || "",
          paymentDetails: payment.details || "",
          medicineExplain: payment.medicineExplain || "",
          nextFollowUp: payment.nextFollowUp || "",
          isSaved: !!payment.status,
          displayId: payment.displayId || "",
        };
      })
    );

    res.status(200).json(merged);
  } catch (err) {
    console.error("Error fetching confirmed appointments:", err);
    res.status(500).json({ error: "Failed to fetch confirmed appointments" });
  }
};

exports.savePaymentInfo = async (req, res) => {
  const { status, details, username, medicineExplain, nextFollowUp, displayId } = req.body;
  const { appointmentId } = req.params;

  if (!status || !username || !displayId) {
    return res.status(400).json({ message: "Status, username, and displayId are required." });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Fetch patient from either Patient or GooglePatient
    let patient = await Patient.findById(appointment.patientId);
    if (!patient) {
      patient = await GooglePatient.findById(appointment.patientId);
    }

    const patientName = patient?.name || appointment.patientName || "N/A";
    const contact = patient?.contact || appointment.patientContact || "N/A";

    // Check for duplicate displayId (must not belong to a different appointment)
    const duplicateDisplayId = await AssistantDoctor.findOne({
      displayId,
      appointmentId: { $ne: appointmentId },
    });

    if (duplicateDisplayId) {
      return res.status(409).json({ message: "Display ID already exists." });
    }

    const payload = {
      appointmentId,
      username,
      status,
      details,
      displayId,
      medicineExplain,
      nextFollowUp,
      patientName,
      contact,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location,
      message: appointment.message,
      notes: appointment.notes,
      action: "Saved",
    };

    // Update or create assistant doctor record
    let existing = await AssistantDoctor.findOne({ appointmentId });

    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      return res.status(200).json({ message: "Payment info updated", data: existing });
    }

    const newRecord = new AssistantDoctor(payload);
    await newRecord.save();

    res.status(200).json({ message: "Payment info saved successfully", data: newRecord });
  } catch (error) {
    console.error("Error saving assistant payment info:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
