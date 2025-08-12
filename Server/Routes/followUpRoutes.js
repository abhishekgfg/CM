const express = require("express");
const router = express.Router();
const {
  getFollowUpRecords,
  markFollowUpDone,
} = require("../Controllers/followUpController");

router.get("/records", getFollowUpRecords);
router.post("/mark-done", markFollowUpDone);

module.exports = router;
