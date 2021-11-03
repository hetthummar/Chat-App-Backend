const express = require("express");
const userStatusController = require("../controllers/user_connnection_status.js");
const router = express.Router();

router.get("/userConnectionStatus", userStatusController.getUserConnectionStatus);

module.exports = router;
