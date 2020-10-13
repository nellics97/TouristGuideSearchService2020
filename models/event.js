const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true },
  place: { type: String, required: true },
  description: { type: String, required: true },
  attendees: { type: Number, required: true },
  creater: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  attendingUsers: [
    { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  ],
});

module.exports = mongoose.model("Event", eventSchema);
