const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userGame: { type: mongoose.Schema.Types.ObjectId, ref: "UserGame", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true }, // 공개 리뷰 조회 기준
    rating: {
      type: Number, // 없으면 미평가
      min: [0.5, "평점은 0.5 이상이어야 합니다."],
      max: [5, "평점은 5 이하여야 합니다."],
      validate: {
        validator: (v) => Number.isInteger(v * 2),
        message: "평점은 0.5 단위로 입력해 주세요.",
      },
    },
    body: {
      type: String,
      trim: true,
      maxlength: [3000, "리뷰는 3000자 이하여야 합니다."],
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 검사 직전: 평점과 리뷰 내용 중 하나는 있어야 한다
reviewSchema.pre("validate", function () {
  if (this.rating == null && !this.body) {
    this.invalidate("rating", "평점이나 리뷰 내용 중 하나는 입력해 주세요.");
  }
});

reviewSchema.index({ user: 1, game: 1 }, { unique: true });
reviewSchema.index({ game: 1, isPublic: 1 });

module.exports = mongoose.model("Review", reviewSchema);
