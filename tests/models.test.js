// 모델 검증 규칙 테스트. DB 연결 없이 doc.validate()만 쓴다
const test = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const User = require("../models/User");
const Game = require("../models/Game");
const UserGame = require("../models/UserGame");
const Review = require("../models/Review");

const id = () => new mongoose.Types.ObjectId();

// 검사에 실패한 필드 이름 목록 (통과하면 빈 배열)
async function invalidFields(doc) {
  try {
    await doc.validate();
    return [];
  } catch (err) {
    return Object.keys(err.errors).sort();
  }
}

test("User: email은 소문자·공백 제거, steam은 없으면 생략", async () => {
  const user = new User({ email: " A@Ex.com ", passwordHash: "x", nickname: "닉네임" });
  assert.deepStrictEqual(await invalidFields(user), []);
  assert.strictEqual(user.email, "a@ex.com");
  assert.strictEqual(user.toObject().steam, undefined);
});

test("User: 닉네임 길이와 SteamID64 형식", async () => {
  const user = new User({ email: "a@ex.com", passwordHash: "x", nickname: "a", steam: { steamId: "123" } });
  assert.deepStrictEqual(await invalidFields(user), ["nickname", "steam.steamId"]);
});

test("Game: steamAppIds는 기본값이 없고 빈 배열이면 지운다", async () => {
  const base = { title: "게임", metadataSource: "igdb", metadataFetchedAt: new Date() };
  const noIds = new Game(base);
  const emptyIds = new Game({ ...base, steamAppIds: [] });
  await noIds.validate();
  await emptyIds.validate();
  assert.ok(!("steamAppIds" in noIds.toObject()));
  assert.ok(!("steamAppIds" in emptyIds.toObject()));
});

test("UserGame: source가 steam이면 steamAppId 필수", async () => {
  const userGame = new UserGame({
    user: id(),
    game: id(),
    ownerships: [{ platform: "steam", source: "steam" }],
  });
  assert.deepStrictEqual(await invalidFields(userGame), ["ownerships.0.steamAppId"]);
});

test("Review: 평점과 내용 중 하나는 있어야 한다", async () => {
  const base = { user: id(), userGame: id(), game: id() };
  assert.deepStrictEqual(await invalidFields(new Review(base)), ["rating"]);
  assert.deepStrictEqual(await invalidFields(new Review({ ...base, body: "   " })), ["rating"]);
  assert.deepStrictEqual(await invalidFields(new Review({ ...base, body: "재밌다" })), []);
});

test("Review: 평점은 0.5~5, 0.5 단위", async () => {
  const base = { user: id(), userGame: id(), game: id() };
  for (const rating of [0.5, 3, 4.5, 5]) {
    assert.deepStrictEqual(await invalidFields(new Review({ ...base, rating })), [], `rating ${rating}`);
  }
  for (const rating of [0, 4.3, 5.5]) {
    assert.deepStrictEqual(await invalidFields(new Review({ ...base, rating })), ["rating"], `rating ${rating}`);
  }
});
