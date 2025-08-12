const express = require("express");
const router = express.Router();
const { syncFollowUpToSheet } = require("../Controllers/followUpSheetController");

router.post("/sync-followup-to-sheet", syncFollowUpToSheet);

module.exports = router;
