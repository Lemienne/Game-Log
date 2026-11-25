const mongoose = require("mongoose");
const { STATUSES, PLATFORMS, OWNERSHIP_SOURCES } = require("../config/constants");

// 플랫폼별 보유 정보
const ownershipSchema = new mongoose.Schema({
  platform: { type: String, required: true, enum: PLATFORMS },
  source: { type: String, required: true, enum: OWNERSHIP_SOURCES }, // steam이면 동기화가 관리
  steamAppId: {
    type: Number,
    required: function () {
      return this.source === "steam";
    },
  },
  playtimeMinutes: { type: Number, default: 0, min: 0 },
  lastPlayedAt: Date,
});

const userGameSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    status: { type: String, enum: STATUSES, default: "none" },
    isFullyCompleted: { type: Boolean, default: false }, // 100% 완료 수동 표시
    ownerships: { type: [ownershipSchema], default: [] }, // 위시리스트는 비어 있다
    totalPlaytimeMinutes: { type: Number, default: 0 }, // ownerships 합계. 저장할 때 다시 계산
    completedAt: Date, // 상태가 completed로 바뀐 시각
  },
  { timestamps: true }
);

// 저장 직전: 플레이 시간 합계 다시 계산
// (save()할 때만 실행된다. UserGame은 항상 읽고 → 고치고 → save()한다)
userGameSchema.pre("save", function () {
  this.totalPlaytimeMinutes = this.ownerships.reduce((sum, o) => sum + o.playtimeMinutes, 0);
});

// 저장 직전: 상태가 이번에 completed로 바뀌었을 때만 시각 기록
userGameSchema.pre("save", function () {
  if (this.isModified("status") && this.status === "completed") {
    this.completedAt = new Date();
  }
});

userGameSchema.index({ user: 1, game: 1 }, { unique: true });
userGameSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("UserGame", userGameSchema);
