const express = require("express");
const router = express.Router();
const { syncPatientsToSheet } = require("../Controllers/sheetController");

router.post("/sync-to-sheet", syncPatientsToSheet);

module.exports = router;
