# Rhytheme Development Documentation

## 프로젝트 개요

Rhytheme은 턴제 협업 비트 메이킹 플랫폼입니다. 최대 8명이 동시에 참여하여 순서대로 비트를 추가하며 음악을 만들어갑니다.

## 아키텍처

### 전체 구조

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  Next.js (FE)   │◄──────►│  Express (BE)   │
│  Vercel         │  HTTP   │  Railway        │
│                 │  WS     │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                            ┌────────┴────────┐
                            │                 │
                    ┌───────▼─────┐   ┌──────▼──────┐
                    │  PostgreSQL │   │    Redis    │
                    │   Railway   │   │   Railway   │
                    └─────────────┘   └─────────────┘
```

### 기술 스택

**Frontend**
- Next.js 16.0.7 (App Router)
- TypeScript
- Tailwind CSS
- Socket.IO Client

**Backend**
- Node.js + Express
- TypeScript
- Socket.IO Server
- Prisma ORM
- Passport.js (Google OAuth)
- Helmet (보안 헤더)

**Database & Cache**
- PostgreSQL (Railway)
- Redis (Railway)

**Deployment**
- Frontend: Vercel (자동 배포)
- Backend: Railway (자동 배포)

---

## 개발 마일스톤

### ✅ M0: 프로젝트 초기 설정
- Next.js + Express 프로젝트 구조
- TypeScript 설정
- Prisma + PostgreSQL 연결
- Redis 연결
- 기본 폴더 구조 설정

### ✅ M1: 에러 처리 시스템
- Global error handler
- Not found handler
- Async handler wrapper
- 표준화된 API 응답 형식

### ✅ M2: Google OAuth 인증
- Passport.js Google Strategy 설정
- JWT 토큰 발급 (Access + Refresh)
- httpOnly 쿠키로 토큰 저장
- 사용자 프로필 관리
- 로그인/회원가입 UI

### ✅ M3: 세션 관리 API
- 세션 CRUD API
- 공개/비공개 세션
- 참여자 관리
- 세션 상태 관리

### ✅ M4: 트랙 관리 API
- 트랙 생성/조회/수정/삭제
- 좋아요 기능
- 조회수 추적
- 갤러리 필터링

### ✅ M5: WebSocket 실시간 통신
- Socket.IO 서버/클라이언트 설정
- 세션 참여/나가기 이벤트
- 실시간 비트 동기화
- 대기열 업데이트 이벤트

### ✅ M6: 턴제 대기열 시스템
- Redis 기반 턴 큐 관리
- 자동 턴 순환
- 턴 타임아웃 처리
- 비트 데이터 검증

### ✅ 보안 강화
- Helmet 보안 헤더 (CSP, HSTS, X-Frame-Options)
- httpOnly 쿠키로 토큰 저장 (XSS 방어)
- CORS 설정 강화
- Rate Limiting (15분당 100 요청)
- Request Size Limits (10MB)

### ✅ 배포
- Railway 백엔드 배포
- Vercel 프론트엔드 배포
- 환경 변수 설정
- CI/CD 파이프라인 (Git Push → Auto Deploy)

### 🚧 M7: 프론트엔드 UI (예정)
- [ ] 대시보드 UI
- [ ] 세션 목록/생성 UI
- [ ] 비트 그리드 UI
- [ ] 대기열 표시 UI

### 🚧 M8: 오디오 엔진 (예정)
- [ ] Web Audio API 통합
- [ ] 8가지 악기 샘플
- [ ] 비트 재생 엔진
- [ ] 실시간 미리듣기

### 🚧 M9: 갤러리 & 공유 (예정)
- [ ] 갤러리 UI
- [ ] 트랙 공유 기능
- [ ] 좋아요/재생 기능
- [ ] 트랙 다운로드

---

## API 엔드포인트

### 인증 (Authentication)

#### `GET /api/auth/google`
Google OAuth 로그인 시작

**Response**: Redirect to Google OAuth

#### `GET /api/auth/google/callback`
Google OAuth 콜백

**Response**:
- httpOnly 쿠키에 토큰 저장
- Redirect to `/auth/callback`

#### `POST /api/auth/refresh`
Access Token 갱신

**Request**:
```json
{
  "refreshToken": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

#### `GET /api/auth/me`
현재 사용자 정보 조회 (보호된 라우트)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "username": "string",
      "avatar": "string"
    }
  }
}
```

### 세션 (Sessions)

#### `POST /api/sessions`
새 세션 생성

**Request**:
```json
{
  "title": "string",
  "maxUsers": 8,
  "isPublic": true
}
```

#### `GET /api/sessions`
세션 목록 조회

**Query Parameters**:
- `isActive`: boolean
- `isPublic`: boolean

#### `GET /api/sessions/:id`
세션 상세 조회

#### `PATCH /api/sessions/:id`
세션 수정

#### `DELETE /api/sessions/:id`
세션 삭제

### 트랙 (Tracks)

#### `POST /api/tracks`
새 트랙 생성

**Request**:
```json
{
  "title": "string",
  "description": "string",
  "sessionId": "string",
  "beatData": {},
  "isPublic": true
}
```

#### `GET /api/tracks`
트랙 목록 조회 (갤러리)

**Query Parameters**:
- `isPublic`: boolean
- `creatorId`: string
- `sessionId`: string

#### `GET /api/tracks/:id`
트랙 상세 조회

#### `PATCH /api/tracks/:id`
트랙 수정

#### `DELETE /api/tracks/:id`
트랙 삭제

#### `POST /api/tracks/:id/like`
트랙 좋아요

#### `POST /api/tracks/:id/play`
트랙 재생 (조회수 증가)

---

## WebSocket 이벤트

### Client → Server

#### `join-session`
세션 참여

```typescript
socket.emit('join-session', sessionId: string)
```

#### `leave-session`
세션 나가기

```typescript
socket.emit('leave-session', sessionId: string)
```

#### `join-queue`
대기열 참여

```typescript
socket.emit('join-queue', {
  sessionId: string,
  name: string,
  avatar: string
})
```

#### `finish-turn`
턴 종료

```typescript
socket.emit('finish-turn', sessionId: string)
```

#### `beat-update`
비트 업데이트

```typescript
socket.emit('beat-update', {
  sessionId: string,
  grid: object
})
```

### Server → Client

#### `beat-update`
비트 동기화

```typescript
socket.on('beat-update', (grid: object) => {
  // Update local beat state
})
```

#### `queue-update`
대기열 업데이트

```typescript
socket.on('queue-update', ({
  queue: Array<{id, name, avatar}>,
  currentTurn: number
}) => {
  // Update queue UI
})
```

---

## 데이터베이스 스키마

### User
```prisma
model User {
  id        String    @id @default(uuid())
  username  String    @unique
  email     String    @unique
  password  String?
  googleId  String?   @unique
  avatar    String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  sessions  Session[]
  tracks    Track[]
}
```

### Session
```prisma
model Session {
  id           String   @id @default(uuid())
  title        String
  maxUsers     Int      @default(8)
  isActive     Boolean  @default(true)
  isPublic     Boolean  @default(true)
  creatorId    String
  beatData     Json     @default("{}")
  participants String[] @default([])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  creator      User     @relation(fields: [creatorId], references: [id])
  tracks       Track[]
}
```

### Track
```prisma
model Track {
  id          String   @id @default(uuid())
  title       String
  description String?
  sessionId   String
  audioUrl    String?
  beatData    Json
  creatorId   String
  likes       Int      @default(0)
  plays       Int      @default(0)
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  creator     User     @relation(fields: [creatorId], references: [id])
  session     Session  @relation(fields: [sessionId], references: [id])
}
```

---

## Redis 데이터 구조

### Session State
```typescript
Key: `session:${sessionId}:state`
Value: {
  queue: Array<{id, name, avatar}>,
  currentTurn: number,
  beatData: object,
  turnStartTime: number
}
TTL: 24 hours
```

---

## 보안 설정

### Helmet 보안 헤더

```typescript
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", FRONTEND_URL],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}
```

### CORS 설정

```typescript
{
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
}
```

### 쿠키 설정

```typescript
{
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 60 * 60 * 1000, // 1 hour (access)
  path: '/',
}
```

---

## 환경 변수

### Backend (server/.env)

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."

# JWT
JWT_SECRET="your-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Session
SESSION_SECRET="your-session-secret"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## 배포 설정

### Railway (Backend)

**Environment Variables**:
- `DATABASE_URL`: Railway PostgreSQL URL
- `REDIS_URL`: Railway Redis URL
- `JWT_SECRET`: Production secret
- `JWT_REFRESH_SECRET`: Production refresh secret
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL`: `https://rhytheme-production.up.railway.app/api/auth/google/callback`
- `SESSION_SECRET`: Production session secret
- `FRONTEND_URL`: Vercel frontend URL
- `NODE_ENV`: `production`

**Build Command**: `npm run build`
**Start Command**: `npm start`

### Vercel (Frontend)

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: Railway backend URL
- `NEXT_PUBLIC_SOCKET_URL`: Railway backend URL

**Framework Preset**: Next.js
**Build Command**: `next build`
**Output Directory**: `.next`

---

## 개발 워크플로우

### 1. 로컬 개발

```bash
# 백엔드 실행
cd server
npm run dev

# 프론트엔드 실행 (새 터미널)
npm run dev
```

### 2. Git 커밋

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### 3. 자동 배포

- Railway: `main` 브랜치 push 시 자동 배포
- Vercel: `main` 브랜치 push 시 자동 배포

### 4. 배포 확인

- Backend Health: https://rhytheme-production.up.railway.app/api/health
- Frontend: https://rhytheme-pjrwf5yg9-y01092042616-gmailcoms-projects.vercel.app

---

## 트러블슈팅

### Railway 빌드 실패

**문제**: TypeScript 컴파일 에러

**해결**:
```bash
cd server
npm run build
# 로컬에서 빌드 테스트
```

### Vercel 빌드 실패

**문제**: Next.js 빌드 에러

**해결**:
```bash
npm run build
# 로컬에서 빌드 테스트
```

### CORS 에러

**문제**: 프론트엔드에서 백엔드 API 호출 실패

**해결**:
1. `FRONTEND_URL` 환경 변수 확인
2. CORS 설정 확인
3. 쿠키 `sameSite` 설정 확인

### WebSocket 연결 실패

**문제**: Socket.IO 연결 안됨

**해결**:
1. `NEXT_PUBLIC_SOCKET_URL` 확인
2. Railway에서 WebSocket 지원 확인
3. CORS 설정 확인

---

## 향후 개발 계획

### Phase 1: UI/UX 완성
- 대시보드 UI
- 세션 관리 UI
- 비트 그리드 UI
- 대기열 시각화

### Phase 2: 오디오 기능
- Web Audio API 통합
- 악기 샘플 로드
- 비트 재생 엔진
- 오디오 녹음/다운로드

### Phase 3: 소셜 기능
- 갤러리 UI 개선
- 댓글 시스템
- 사용자 프로필
- 팔로우 시스템

### Phase 4: 고급 기능
- 템포 조절
- 이펙트 (리버브, 딜레이)
- 루프 기능
- 멀티 패턴 지원

---

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Helmet Documentation](https://helmetjs.github.io/)
