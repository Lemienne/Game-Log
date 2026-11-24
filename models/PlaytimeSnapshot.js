const mongoose = require("mongoose");

// 동기화 시점의 누적 플레이 시간 기록. MVP에서는 쓰기만 한다 (월간 통계용)
const playtimeSnapshotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userGame: { type: mongoose.Schema.Types.ObjectId, ref: "UserGame", required: true },
  steamAppId: { type: Number, required: true },
  playtimeMinutes: { type: Number, required: true }, // 그 시점의 누적값
  capturedAt: { type: Date, required: true, default: Date.now },
});

playtimeSnapshotSchema.index({ userGame: 1, capturedAt: -1 });

module.exports = mongoose.model("PlaytimeSnapshot", playtimeSnapshotSchema);
