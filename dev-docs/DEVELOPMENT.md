# Rhytheme Development Guide

> **Note**: 이 문서는 개발자용입니다. 사용자 가이드는 [README.md](../README.md)를 참조하세요.

---

## Tech Stack

### Frontend

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tone.js](https://img.shields.io/badge/Tone.js-000000?style=for-the-badge&logo=javascript&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Deployment & Infrastructure

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

---

## Project Structure

### Frontend Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing Page
│   ├── session/[id]/      # Session Room
│   └── dashboard/         # Music Gallery
├── components/            # React Components
│   ├── BeatSequencer.tsx  # 비트 제작 그리드
│   ├── AudioEngine.tsx    # Tone.js 오디오 엔진
│   ├── QueuePanel.tsx     # 대기열 UI
│   └── SessionControls.tsx
├── hooks/                 # Custom React Hooks
├── lib/                   # Utilities
└── styles/                # Global Styles
```

### Backend Architecture

```
server/
├── src/
│   ├── index.ts           # Express 서버 진입점
│   ├── routes/            # REST API 라우트
│   │   ├── auth.ts
│   │   ├── sessions.ts
│   │   └── tracks.ts
│   ├── websocket/         # Socket.io 핸들러
│   │   └── sessionHandler.ts
│   ├── services/          # 비즈니스 로직
│   │   ├── QueueService.ts
│   │   └── SessionService.ts
│   ├── middleware/        # 미들웨어
│   │   ├── auth.ts
│   │   ├── rateLimiter.ts
│   │   └── validation.ts
│   └── config/            # 설정 파일
└── prisma/
    └── schema.prisma      # DB 스키마
```

---

## System Architecture

```mermaid
graph TB
    subgraph Client
        A[Next.js Frontend]
        B[Tone.js Audio Engine]
    end

    subgraph Server
        C[Express API]
        D[Socket.io Server]
    end

    subgraph Database
        E[(PostgreSQL)]
        F[(Redis)]
    end

    subgraph Storage
        G[Cloudflare R2]
    end

    A -->|REST API| C
    A -->|WebSocket| D
    B -->|Audio Export| G
    C --> E
    D --> F
    C --> G
```

---

## Database Schema (ERD)

```mermaid
erDiagram
    User ||--o{ Session : creates
    User ||--o{ Track : creates
    Session ||--o{ Track : generates

    User {
        string id PK
        string username
        string email
        string password
        datetime createdAt
    }

    Session {
        string id PK
        string title
        int maxUsers
        boolean isActive
        string creatorId FK
        json beatData
        string[] participants
        datetime createdAt
        datetime updatedAt
    }

    Track {
        string id PK
        string title
        string sessionId FK
        string audioUrl
        json beatData
        string creatorId FK
        int likes
        int plays
        datetime createdAt
    }
```

---

## Development Setup

### Prerequisites

- Node.js 18.x 이상
- npm 또는 yarn
- PostgreSQL (선택사항, Railway 사용 가능)
- Redis (선택사항, Railway 사용 가능)

### Installation

```bash
# Repository 클론
git clone https://github.com/tygwan/rhytheme.git
cd rhytheme

# Frontend 의존성 설치
npm install

# Backend 의존성 설치
cd server
npm install
cd ..
```

### Environment Variables

**Frontend (`.env.local`)**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Backend (`server/.env`)**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/rhytheme
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Running Locally

```bash
# Frontend 실행 (터미널 1)
npm run dev

# Backend 실행 (터미널 2)
cd server
npm run dev
```

프론트엔드: [http://localhost:3000](http://localhost:3000)
백엔드 API: [http://localhost:3001](http://localhost:3001)

### Database Setup

```bash
# Prisma migrate
cd server && npx prisma migrate dev

# Prisma studio (DB GUI)
cd server && npx prisma studio
```

---

## Key Implementation Details

### 1. Turn-based Queue System

**Redis 기반 Queue Service**로 정확한 순서 관리:

```typescript
class QueueService {
  async addToQueue(sessionId: string, userId: string) {
    await redis.rpush(`queue:${sessionId}`, userId);
  }

  async getNextInQueue(sessionId: string) {
    return await redis.lpop(`queue:${sessionId}`);
  }
}
```

### 2. Real-time Sync

**Socket.io**로 모든 참여자에게 실시간 상태 브로드캐스트:

```typescript
socket.on('update-beat', (data) => {
  // 턴 검증
  if (!validateTurn(sessionId, userId)) return;

  // 비트 데이터 저장
  saveBeatData(sessionId, data);

  // 모든 참여자에게 브로드캐스트
  io.to(sessionId).emit('session-update', data);
});
```

### 3. Web Audio API

**Tone.js**를 활용한 브라우저 기반 오디오 엔진:

```typescript
const synth = new Tone.Sampler({
  urls: { C4: "kick.wav" },
  baseUrl: "/samples/"
}).toDestination();

// 16-step 시퀀서
const sequence = new Tone.Sequence((time, step) => {
  if (beatData[step]) {
    synth.triggerAttackRelease("C4", "8n", time);
  }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
```

---

## Deployment

### Frontend (Vercel)

```bash
vercel --prod
```

### Backend (Railway)

```bash
railway up
```

---

## Development Timeline

- **2024.11.24** 프로젝트 기획 및 아키텍처 설계
- **2024.11.25** 기술 스택 확정 (Vercel + Railway)
- **2024.11.27** 보안 & 트래픽 관리 전략 수립
- **2024.12.02** 프로젝트 초기화 및 개발 시작
- **2024.12.06** 인프라 연결 (Railway PostgreSQL + Redis)

---

## Contributing

개발 참여에 관심이 있으시다면 [Issues](https://github.com/tygwan/rhytheme/issues)를 확인해주세요.

## License

This project is licensed under the MIT License.
