const express = require("express");
const router = express.Router();
const {
  importGooglePatients,
  getGooglePatients,
  updateStatus,
  deleteGooglePatient,
} = require("../Controllers/googlePatientController");

router.post("/import", importGooglePatients);
router.get("/all", getGooglePatients);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteGooglePatient);

module.exports = router;
