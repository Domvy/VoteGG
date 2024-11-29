const mongoose = require("mongoose");

// MongoDB 연결
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/your_database_name";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected for Invite schema");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// 초대 스키마 정의
const InviteSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// 모델 생성 및 내보내기
module.exports = mongoose.model("Invite", InviteSchema);
