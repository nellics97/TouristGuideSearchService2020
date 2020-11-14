const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  receiver: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Review", userSchema);
