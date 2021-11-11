const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();

router.post("/", messageController.addMessage);
router.patch("/updateMsgSeenTime", messageController.updateMsgSeenTime);
router.patch("/updateMsgDeliverTime", messageController.updateMsgDeliverTime);
router.get("/getMissedMessage", messageController.getMissedMessage);
router.patch("/updateSenderLocalMsgStatus", messageController.msgUpdatedLocallyForSender);

module.exports = router;
