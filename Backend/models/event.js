const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  guide: { type: Boolean, required: false },
  title: { type: String, required: true },
  place: { type: String, required: true },
  date: { type: String, required: false },
  description: { type: String, required: true },
  attendees: { type: Number, required: true },
  tags: [{ type: String, required: false }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  participant: [
    { type: mongoose.Types.ObjectId, required: false, ref: "User" },
  ],
  messages: [
    { type: mongoose.Types.ObjectId, required: false, ref: "Message" },
  ],
});

module.exports = mongoose.model("Event", eventSchema);
