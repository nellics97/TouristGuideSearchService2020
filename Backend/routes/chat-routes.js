const express = require("express");
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const { check } = require("express-validator");

const chatController = require("../controllers/chat-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();
require("express-ws")(router);

router.use(checkAuth);

router.ws("/:eid", chatController.handleChatWs);

//router.get("/:eid", chatController.getMessagesByEventId);

//router.post(
//  "/:eid",
//  [check("text").isLength({ min: 1 })],
//  chatController.sendMessage
//);

module.exports = router;
