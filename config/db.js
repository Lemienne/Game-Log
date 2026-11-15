const mongoose = require("mongoose");
const env = require("./env.js");    // 환경 변수 불러오기

// 연결 promise 보관해 재사용
let connection = null;

// mongoDB 연결
function connectDB() {
  // connection 비어있다면 promise 보관 후 연결 시도
  if (!connection) {
    connection = mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 5000 }) // 연결 오래 안기다림
    .then(() => {
      console.log("MongoDB 연결: " + mongoose.connection.name);
    })
    // 연결 실패 시 promise 비움
    .catch((err) => {
      connection = null;
      throw err;
    })
  }
  return connection;
};

module.exports = connectDB;
