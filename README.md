# GameLog

게임 라이브러리와 플레이 기록을 관리하는 웹 애플리케이션.

Node.js · Express 5 · EJS · MongoDB(Mongoose) · Vercel

## 실행

Node.js 22 이상이 필요하다.

```bash
npm install
cp .env.example .env   
npm run dev            # http://localhost:3000, 파일을 고치면 자동 재시작
```

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (nodemon) |
| `npm start` | 일반 실행 |
| `npm test` | `tests/`의 테스트 실행 (`node --test`) |

## 폴더

```
app.js          Express 앱 구성. Vercel 진입점
bin/www         로컬 실행용. 포트를 연다
config/         환경 변수, DB, 세션, 상수
models/         Mongoose 모델
routes/         URL → 컨트롤러 연결
controllers/    요청 처리, 화면 렌더링
services/       IGDB·Steam 연동, 여러 모델에 걸친 로직
middleware/     로그인·소유권 확인, 에러 처리
views/          EJS 화면 (partials/ 와 기능별 폴더)
public/         정적 파일 (CSS, 브라우저 JS, 이미지)
tests/          단위 테스트
```

## 협업

- `main`에 직접 커밋하지 않는다. 이슈 → `종류/번호-내용` 브랜치 → PR → Squash and merge.
- 커밋 메시지: `종류: 무엇을 했는지 (#이슈번호)` (종류: `feat`, `fix`, `style`, `refactor`, `docs`, `test`, `chore`)
- `.env`와 API 키는 저장소, 이슈, PR 어디에도 올리지 않는다.
