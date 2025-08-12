const express = require("express");
const router = express.Router();
const {
  getAllPackageRecords,
  savePackageRecord,
} = require("../Controllers/packageController");

router.get("/all", getAllPackageRecords);
router.post("/save", savePackageRecord);

module.exports = router;
