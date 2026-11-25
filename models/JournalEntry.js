const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userGame: { type: mongoose.Schema.Types.ObjectId, ref: "UserGame", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true }, // 목록에서 게임 이름을 바로 붙이기 위한 중복 참조
    title: {
      type: String,
      required: [true, "제목을 입력해 주세요."],
      trim: true,
      maxlength: [100, "제목은 100자 이하여야 합니다."],
    },
    body: {
      type: String,
      required: [true, "내용을 입력해 주세요."],
      trim: true,
      maxlength: [5000, "내용은 5000자 이하여야 합니다."],
    },
    playedOn: { type: Date, required: true, default: Date.now }, // 플레이 날짜
  },
  { timestamps: true }
);

journalEntrySchema.index({ user: 1, playedOn: -1 });
journalEntrySchema.index({ userGame: 1, playedOn: -1 });

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
