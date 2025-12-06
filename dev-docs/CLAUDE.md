# Rhytheme - Claude Code Project Instructions

## Project Overview

**Rhytheme** ("Rhythm + Lead Me")는 턴제 방식의 협업 비트 제작 웹 애플리케이션입니다.

```
참여자들이 하나씩 비트를 찍어가며 rhythm을 lead me (리드미) 한다
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.6 (App Router)
- **Runtime**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion 12.x
- **Audio**: Tone.js 15.x
- **WebSocket**: Socket.io-client 4.x

### Backend
- **Framework**: Express.js 4.x
- **WebSocket**: Socket.io 4.x
- **Database**: PostgreSQL (via Prisma)
- **Cache/Queue**: Redis (via ioredis)
- **Auth**: JWT (jsonwebtoken + bcrypt)

### Deployment
- **Frontend**: Vercel (MCP 연동됨)
- **Backend**: Railway (MCP 연동됨)

## Project Structure

```
rhytheme/
├── src/                      # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── layout.tsx       # Root layout with Providers
│   │   ├── providers.tsx    # AuthProvider wrapper
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   ├── session/[id]/    # Session room
│   │   └── dashboard/       # Gallery (미구현)
│   ├── components/
│   │   └── BeatSequencer.tsx
│   └── hooks/
│       ├── useSocket.ts
│       └── useAuth.tsx      # Auth context & hook
├── server/                   # Backend (Express)
│   ├── src/
│   │   ├── index.ts         # Main server
│   │   ├── routes/
│   │   │   ├── auth.ts      # Auth API routes
│   │   │   ├── session.ts   # Session API routes
│   │   │   └── track.ts     # Track API routes
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── sessionService.ts
│   │   │   └── trackService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts      # JWT middleware
│   │   │   ├── validate.ts  # Zod validation
│   │   │   └── errorHandler.ts
│   │   └── utils/
│   │       ├── errors.ts    # Custom error classes
│   │       ├── asyncHandler.ts
│   │       └── validation.ts # Zod schemas
│   └── prisma/
│       └── schema.prisma    # DB schema
└── dev-docs/                 # Development documentation
```

## Development Guidelines

### Code Style
- TypeScript strict mode 사용
- ESLint + Prettier 규칙 준수
- 컴포넌트는 함수형 + hooks 패턴
- API는 RESTful 설계 원칙

### Naming Conventions
- Components: PascalCase (e.g., `BeatSequencer.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useSocket.ts`)
- API routes: kebab-case (e.g., `/api/sessions`)
- DB tables: PascalCase (Prisma convention)

### TDD Approach
- RED → GREEN → REFACTOR → COMMIT 사이클
- 테스트 커버리지 목표: 70%+ (MVP)
- E2E: Playwright 사용

### Test Frameworks
- **Frontend**: Vitest + @testing-library/react + msw
- **Backend**: Jest + ts-jest + supertest
- **E2E**: Playwright

## Current Status

### Implemented (M0-M5 완료)
- Landing page UI
- Session room with BeatSequencer (all 8 instruments working)
- WebSocket real-time sync (basic)
- Turn-based queue system (UI)
- Tone.js audio playback
- PostgreSQL 연결 (Railway)
- Redis 연결 (Railway)
- Prisma 마이그레이션 완료 (User, Session, Track 모델)
- **Error Handling Framework** (M1)
  - Custom errors (ValidationError, AuthError, NotFoundError)
  - Global error handler middleware
  - Enhanced health check with DB/Redis status
- **Authentication System** (M2)
  - User registration/login with bcrypt
  - JWT access/refresh tokens
  - Auth middleware for protected routes
  - Zod validation schemas
  - Frontend login/register pages
  - AuthContext + useAuth hook
- **Session & Track API** (M3)
  - Session CRUD (create, read, update, delete)
  - Session participation (join, leave)
  - Session beat data management
  - Track CRUD (create, read, update, delete)
  - Track engagement (like, play count)
  - Validation schemas for Session/Track
- **Frontend Integration** (M4)
  - Dashboard page (session list, create session)
  - Gallery page (track list with sorting)
  - Landing page with auth-aware navigation
  - Session create modal with validation
  - Track visualization in gallery
- **Session Room Integration** (M5)
  - Save track button in session room header
  - Save track modal with title and description
  - Track creation from session room with API integration
  - Auto-redirect to gallery after saving

### Not Implemented
- Audio export (download as WAV/MP3)
- Server-side turn validation
- Real-time enhancements (turn timeout, BPM sync)
- Session beat data persistence with backend API

## Commands

### Development
```bash
# Frontend
npm run dev

# Backend
cd server && npm run dev
```

### Database
```bash
# Prisma migrate
cd server && npx prisma migrate dev

# Prisma studio
cd server && npx prisma studio
```

### Deployment
```bash
# Vercel (Frontend)
vercel --prod

# Railway (Backend)
railway up
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Backend (server/.env)
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Key Files Reference

| 파일 | 설명 | 상태 |
|------|------|------|
| `src/app/page.tsx` | 랜딩 페이지 | ✅ Auth 통합 |
| `src/app/login/page.tsx` | 로그인 페이지 | ✅ 완료 |
| `src/app/register/page.tsx` | 회원가입 페이지 | ✅ 완료 |
| `src/app/dashboard/page.tsx` | 대시보드 (세션 목록) | ✅ 완료 |
| `src/app/gallery/page.tsx` | 갤러리 (트랙 목록) | ✅ 완료 |
| `src/app/session/[id]/page.tsx` | 세션 룸 | ✅ 완료 |
| `src/components/BeatSequencer.tsx` | 비트 시퀀서 | ✅ 완료 |
| `src/hooks/useSocket.ts` | WebSocket 훅 | ✅ 완료 |
| `src/hooks/useAuth.tsx` | Auth Context & Hook | ✅ 완료 |
| `server/src/index.ts` | Express 서버 | ✅ Session/Track 통합 |
| `server/src/routes/auth.ts` | Auth API 라우트 | ✅ 완료 |
| `server/src/routes/session.ts` | Session API 라우트 | ✅ 완료 |
| `server/src/routes/track.ts` | Track API 라우트 | ✅ 완료 |
| `server/src/services/authService.ts` | 인증 서비스 | ✅ 완료 |
| `server/src/services/sessionService.ts` | 세션 서비스 | ✅ 완료 |
| `server/src/services/trackService.ts` | 트랙 서비스 | ✅ 완료 |
| `server/src/middleware/auth.ts` | JWT 미들웨어 | ✅ 완료 |
| `server/src/middleware/validate.ts` | Zod 검증 | ✅ 완료 |
| `server/src/middleware/errorHandler.ts` | 에러 핸들러 | ✅ 완료 |
| `server/src/utils/validation.ts` | Zod 스키마 | ✅ Session/Track 추가 |
| `server/prisma/schema.prisma` | DB 스키마 | ✅ 마이그레이션 완료 |
| `server/.env` | 백엔드 환경변수 | ✅ 설정됨 |

## MCP Servers Available

- **Vercel**: 프론트엔드 배포 자동화
- **Railway**: 백엔드 배포 자동화

## Skills Available

프로젝트 `.claude/skills/` 디렉토리에 설치된 스킬:

- `artifacts-builder`: UI 컴포넌트 생성
- `senior-backend`: 백엔드 개발 전문
- `senior-architect`: 시스템 아키텍처
- `webapp-testing`: Playwright 테스팅
- `tdd-mvp-planner`: 개발 계획 수립
- `vercel`: 배포 자동화
- `codex-claude-loop`: AI 협업

## Notes

- 실시간 협업이 핵심 기능이므로 WebSocket 안정성 중요
- 오디오 지연 최소화를 위한 Web Audio API 최적화 필요
- 턴 타임아웃(30초) 로직 서버측 구현 필요
- 서버 측 턴 검증 구현 필수 (보안)
- 브라우저 오디오 정책: 사용자 제스처 후 AudioContext.resume() 필요
