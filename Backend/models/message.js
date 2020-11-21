const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  event: { type: mongoose.Types.ObjectId, required: true, ref: "Event" },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  text: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model("Message", messageSchema);
