const express = require("express");
const router = express.Router();
const { applyLeave, getLeaves } = require("../Controllers/leaveController");

router.post("/", applyLeave);


module.exports = router;
