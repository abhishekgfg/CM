const express = require("express");
const router = express.Router();
const { saveAttendance, getAttendanceByDate, getAllAttendance, getAttendanceByMonth } = require("../controllers/attendanceController");

router.post("/", saveAttendance);
router.get("/", getAttendanceByDate);
router.get("/all", getAllAttendance); // <-- added this
router.get("/month", getAttendanceByMonth);


module.exports = router;
