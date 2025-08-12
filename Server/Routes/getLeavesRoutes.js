const express = require("express");
const router = express.Router();
const { getLeaves, updateLeaveStatus } = require("../Controllers/getLeavesController");

router.get("/", getLeaves);
router.post("/:id/status", updateLeaveStatus);

module.exports = router;
