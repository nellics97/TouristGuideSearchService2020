const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  receiver: { type: String, required: true },
});

module.exports = mongoose.model("Review", reviewSchema);
