const mongoose = require("mongoose");
const { METADATA_SOURCES } = require("../config/constants");

const gameSchema = new mongoose.Schema(
  {
    igdbId: Number, // 없으면 필드 생략
    steamAppIds: { type: [Number], default: undefined }, // 없으면 필드 생략. 빈 배열로 저장하지 않는다
    title: { type: String, required: true, trim: true },
    coverImageId: String, // IGDB image_id
    coverUrl: String, // IGDB 이미지가 없을 때 쓰는 전체 주소 (Steam 게임용)
    summary: String,
    genres: { type: [String], default: [] },
    platforms: { type: [String], default: [] }, // 표시용. PLATFORMS 상수와 무관
    developers: { type: [String], default: [] },
    publishers: { type: [String], default: [] },
    firstReleaseDate: Date,
    metadataSource: { type: String, required: true, enum: METADATA_SOURCES },
    metadataFetchedAt: { type: Date, required: true }, // 캐시 갱신 기준
  },
  { timestamps: true }
);

// 빈 배열이 들어오면 필드를 지운다 (빈 배열끼리 unique 충돌 방지)
gameSchema.pre("validate", function () {
  if (this.steamAppIds && this.steamAppIds.length === 0) {
    this.steamAppIds = undefined;
  }
});

// 값이 숫자로 있을 때만 중복 금지 (없거나 null, 빈 배열이면 검사하지 않음)
gameSchema.index(
  { igdbId: 1 },
  { unique: true, partialFilterExpression: { igdbId: { $type: "number" } } }
);
gameSchema.index(
  { steamAppIds: 1 },
  { unique: true, partialFilterExpression: { steamAppIds: { $type: "number" } } }
);

module.exports = mongoose.model("Game", gameSchema);
