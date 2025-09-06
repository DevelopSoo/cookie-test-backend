const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/cookie", (req, res) => {
  res.json({ token: req.cookies.accessToken });
});

// 방식
// 1. 프론트엔드와 백엔드 도메인이 다를 땐 same-site 설정이 아예 먹지 않는지 확인 -> 쿠키 설정 안됨
// 2. domain을 프론트엔드로 설정 & samesite strict 했을 때, 쿠키가 설정되는지 확인 -> 500 에러 발생
// 3. samesite lax로 변경했을 때, 쿠키가 설정되는지 확인
// 3. domain을 백엔드 주소로 설정했을 때, 쿠키가 설정되는지 확인
// 백엔드에서 토큰을 쿠키로 전달하는 방법
app.post("/api/cookie", (req, res) => {
  res.cookie("accessToken", "token-value", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24, // 24시간
  });
  res.json({ message: "테스트 쿠키가 설정되었습니다." });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`${process.env.CLIENT_URL}:${port}`);
});
