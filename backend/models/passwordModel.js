const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  password: String,
});

exports.passwordModel = mongoose.model("passwords", passwordSchema);
