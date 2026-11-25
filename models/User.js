const mongoose = require("mongoose");
const { SYNC_STATUSES } = require("../config/constants");

// Steam 연결 정보. 연결 전과 해제 후에는 steam 필드 자체가 없다
const steamSchema = new mongoose.Schema(
  {
    steamId: {
      type: String,
      required: true,
      match: [/^\d{17}$/, "SteamID64는 숫자 17자리입니다."],
    },
    personaName: String,
    linkedAt: Date,
    lastSyncedAt: Date,
    lastSyncStatus: { type: String, enum: SYNC_STATUSES },
    lastSyncSummary: {
      added: Number,
      updated: Number,
      unmatched: Number,
    },
    syncStartedAt: Date, // 동기화 잠금. 5분이 지나면 무효로 본다
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "이메일을 입력해 주세요."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    nickname: {
      type: String,
      required: [true, "닉네임을 입력해 주세요."],
      trim: true,
      minlength: [2, "닉네임은 2자 이상이어야 합니다."],
      maxlength: [20, "닉네임은 20자 이하여야 합니다."],
    },
    steam: steamSchema,
  },
  { timestamps: true }
);

// steamId가 문자열로 있을 때만 중복 금지 (없거나 null이면 검사하지 않음)
userSchema.index(
  { "steam.steamId": 1 },
  { unique: true, partialFilterExpression: { "steam.steamId": { $type: "string" } } }
);

module.exports = mongoose.model("User", userSchema);
