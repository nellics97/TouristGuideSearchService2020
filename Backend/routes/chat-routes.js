const express = require("express");
const { check } = require("express-validator");

const chatController = require("../controllers/chat-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:eid", chatController.getMessagesByEventId);

router.use(checkAuth);

router.post(
  "/:eid",
  [check("text").isLength({ min: 1 })],
  chatController.sendMessage
);

module.exports = router;
