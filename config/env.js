require("dotenv").config({ quiet: true });

// 필수 환경 변수
const required = ["MONGODB_URI", "SESSION_SECRET"];

// 환경 변수 유무 검사
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error("환경 변수가 없습니다: " + missing.join(", "));
}

// 배열로 한번에 Export
module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  mongodbUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  twitchClientId: process.env.TWITCH_CLIENT_ID,
  twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  steamApiKey: process.env.STEAM_API_KEY,
};
