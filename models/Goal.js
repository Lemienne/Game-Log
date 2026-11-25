const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userGame: { type: mongoose.Schema.Types.ObjectId, ref: "UserGame", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    text: {
      type: String,
      required: [true, "목표를 입력해 주세요."],
      trim: true,
      maxlength: [200, "목표는 200자 이하여야 합니다."],
    },
    isDone: { type: Boolean, default: false },
    doneAt: Date,
  },
  { timestamps: true }
);

// 저장 직전: 완료 여부가 바뀌면 완료 시각을 기록하거나 지운다
goalSchema.pre("save", function () {
  if (this.isModified("isDone")) {
    this.doneAt = this.isDone ? new Date() : undefined;
  }
});

goalSchema.index({ userGame: 1 });
goalSchema.index({ user: 1, isDone: 1 });

module.exports = mongoose.model("Goal", goalSchema);
