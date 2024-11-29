const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // 중복된 닉네임 방지
  },
  password: {
    type: String,
    required: true,
  },
  invited: [
    {
      roomId: {
        type: String,
        required: true,
      },
      inviter: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("user", userSchema);