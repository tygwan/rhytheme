# 🎵 Rhythme

**"Rhythm + Lead Me"** - 협업 비트 제작 웹 애플리케이션

<div align="center">

![Rhythme Logo](./docs/images/logo.png)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[Live Demo](https://rhythme.vercel.app)** | **[Documentation](./docs)** | **[Development Blog](https://github.com/tygwan/rhytheme/wiki)**

</div>

## 🚧 Development Status

> **Current Phase**: 🏗️ Project Initialization & Infrastructure Setup
> **Last Updated**: 2024.12.02

---

## 📖 프로젝트 소개

Rhythme은 **턴제 방식**으로 참여자들이 함께 비트를 쌓아가며 음악을 만드는 협업 웹 플랫폼입니다.

```
"참여자들이 하나씩 비트를 찍어가며 rhythm을 lead me (리드미) 한다"
```

### 🎯 기획 배경

- 전통적인 음악 제작 도구(DAW)는 전문가 중심으로 설계되어 진입장벽이 높음
- 실시간 협업 도구들은 동시 편집으로 인한 혼선 발생
- 음악을 쉽게 만들면서도 협업의 재미를 느낄 수 있는 플랫폼의 필요성

### 💡 핵심 차별점

- 🎮 **턴제 협업** - 순차적 비트 추가로 혼선 방지
- 📋 **대기열 시스템** - 체계적인 참여 순서 관리
- 🚪 **세션 기반 방** - 독립적인 음악 제작 공간
- 🎨 **대시보드 공유** - 완성된 작품을 커뮤니티와 공유

---

## 📑 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [주요 기능](#-주요-기능)
3. [기술 스택](#-기술-스택)
4. [프로젝트 기간](#-프로젝트-기간)
5. [팀원](#-팀원)
6. [프로젝트 세팅](#-프로젝트-세팅)
7. [아키텍처](#-아키텍처)
8. [데이터베이스 설계](#-데이터베이스-설계)
9. [주요 구현 내용](#-주요-구현-내용)
10. [개발 기록](#-개발-기록)

---

## ✨ 주요 기능

### 🎹 비트 제작

- **16-Step Sequencer**: 직관적인 그리드 기반 비트 제작
- **8가지 악기**: Kick, Snare, Hi-Hat, Clap, Tom, Synth, Bass, Percussion
- **실시간 재생**: BPM 조절 및 즉시 미리듣기
- **오디오 이펙트**: Reverb, Delay, Octave 등 다양한 효과

### 🚪 세션 관리

- **방 생성**: 커스텀 설정으로 세션 생성
- **인원 제한**: 세션당 4-8명 권장
- **대기열 시스템**: 자동 턴 관리
- **실시간 동기화**: WebSocket 기반 상태 공유

### 🎨 대시보드

- **음악 갤러리**: 완성된 트랙 공개 공유
- **재생 & 다운로드**: 언제든 재생 및 내보내기
- **좋아요 & 댓글**: 커뮤니티 상호작용
- **필터링**: 최신순, 인기순 정렬

---

## 🛠 기술 스택

### Frontend

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tone.js](https://img.shields.io/badge/Tone.js-000000?style=for-the-badge&logo=javascript&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

</div>

### Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

</div>

### Deployment & Infrastructure

<div align="center">

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

</div>

### Development Tools

<div align="center">

![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

</div>

---

## 📅 프로젝트 기간

**2024.11.24 - 진행 중**

- **설계 & 기획**: 2024.11.24 - 2024.11.27
- **개발**: 2024.12.02 - 진행 중
- **테스트 & 배포**: 예정

---

## 👥 팀원

<div align="center">

| Role | Name | GitHub |
|:---:|:---:|:---:|
| **Full Stack Developer** | tygwan | [@tygwan](https://github.com/tygwan) |

</div>

---

## ⚙️ 프로젝트 세팅

### Prerequisites

- Node.js 18.x 이상
- npm 또는 yarn
- PostgreSQL (선택사항, Supabase 사용 가능)
- Redis (선택사항, Upstash 사용 가능)

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
PORT=3001
NODE_ENV=development
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

---

## 🏗 아키텍처

### System Architecture

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

## 💾 데이터베이스 설계

### ERD

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

## 🔑 주요 구현 내용

### 1. 턴제 대기열 시스템

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

### 2. 실시간 동기화

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

## 📝 개발 기록

자세한 개발 과정은 [Wiki](https://github.com/tygwan/rhytheme/wiki)에서 확인하실 수 있습니다.

### 주요 마일스톤

- **[2024.11.24]** 프로젝트 기획 및 아키텍처 설계
- **[2024.11.25]** 기술 스택 확정 (Vercel + Railway)
- **[2024.11.27]** 보안 & 트래픽 관리 전략 수립
- **[2024.12.02]** 프로젝트 초기화 및 개발 시작

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by collaborative music-making platforms
- Special thanks to the open-source community
- Audio samples from [Freesound.org](https://freesound.org)

---

<div align="center">

**Made with ❤️ by tygwan**

⭐ Star this repository if you find it helpful!

</div>
