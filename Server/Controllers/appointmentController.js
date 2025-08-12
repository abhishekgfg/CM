const Appointment = require("../Models/Appointment");
const Patient = require("../Models/Patient");
const GooglePatient = require("../Models/GooglePatientModel");

// ✅ Add new appointment
exports.addAppointment = async (req, res) => {
  const { patientId, date, time, notes, location, message } = req.body;
  const username = req.headers.username;

  if (!patientId || !username || !date || !time || !location) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let patient = await Patient.findById(patientId);
    if (!patient) {
      patient = await GooglePatient.findById(patientId);
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const newAppointment = new Appointment({
      patientId,
      patientName: patient.name || "N/A",
      patientContact: patient.contact || "N/A",
      date,
      time,
      notes,
      location,
      message,
      createdBy: username,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment added", appointment: newAppointment });
  } catch (err) {
    console.error("❌ Error adding appointment:", err);
    res.status(500).json({ error: "Failed to add appointment" });
  }
};

// ✅ Get all appointments with name/contact fallback
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();

    const populated = await Promise.all(
      appointments.map(async (a) => {
        let patient = await Patient.findById(a.patientId);
        if (!patient) {
          patient = await GooglePatient.findById(a.patientId);
        }

        return {
          ...a.toObject(),
          patientId: {
            _id: a.patientId,
            name: patient?.name || a.patientName || "N/A",
            contact: patient?.contact || a.patientContact || "N/A",
          },
        };
      })
    );

    res.json(populated);
  } catch (err) {
    console.error("Error in getAllAppointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// ✅ Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: status.trim() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Appointment not found" });

    res.json({ message: "Status updated", appointment: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// ✅ Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const role = req.headers.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Access Denied: Only admin can delete." });
    }

    const found = await Appointment.findById(req.params.id);
    if (!found) return res.status(404).json({ error: "Appointment not found" });

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

// ✅ Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date, time, location, message, status } = req.body;

    if (!date || !time || status !== "Rescheduled") {
      return res.status(400).json({ error: "Date, time, and valid reschedule status are required" });
    }

    const updateFields = { date, time, status };
    if (location) updateFields.location = location;
    if (message) updateFields.message = message;

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Appointment not found" });

    res.json({ message: "Appointment rescheduled", appointment: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to reschedule appointment" });
  }
};
