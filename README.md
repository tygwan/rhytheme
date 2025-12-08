# Rhytheme

**"Rhythm + Lead Me"** - 함께 비트를 만드는 협업 음악 플랫폼

<div align="center">

[![Play Now](https://img.shields.io/badge/Play_Now-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://rhytheme-pjrwf5yg9-y01092042616-gmailcoms-projects.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-In_Development-orange)](https://github.com/tygwan/rhytheme)

</div>

---

## 🎵 어떤 게임인가요?

Rhytheme은 여러 사람이 **순서대로 비트를 쌓아가며** 함께 음악을 만드는 협업 게임입니다.

```
참여자들이 하나씩 비트를 찍어가며 rhythm을 lead me (리드미) 한다
```

전문적인 음악 지식 없이도 누구나 쉽게 비트를 만들고, 다른 사람들과 협업하여 멋진 트랙을 완성할 수 있습니다!

---

## ✨ 게임 특징

### 🎮 턴제 협업
- 한 번에 한 명씩 비트를 추가
- 혼선 없이 차례대로 음악 제작
- 다른 사람의 턴을 기다리는 동안 미리보기 가능

### 🎹 8가지 악기
- **Kick** - 베이스 드럼
- **Snare** - 스네어 드럼
- **Hi-Hat** - 하이햇 심벌
- **Clap** - 박수/클랩
- **Tom** - 탐탐 드럼
- **Synth** - 신디사이저
- **Bass** - 베이스라인
- **Perc** - 퍼커션

### 🔄 실시간 세션
- 최대 8명과 함께 참여
- 실시간으로 다른 참여자의 비트 확인
- 즉시 재생 및 미리듣기

### 📱 공유 & 커뮤니티
- 완성된 트랙을 갤러리에 공유
- 다른 사람의 트랙 감상
- 좋아요와 재생 수 확인

---

## 🎯 게임 방법

1. **Google 로그인**
   - Google 계정으로 간편하게 시작

2. **세션 참여하기**
   - 공개 세션에 참여하거나 새 세션 만들기
   - 친구와 함께라면 비공개 세션 생성

3. **내 차례 기다리기**
   - 대기열에서 순서 확인
   - 다른 참여자의 비트 실시간 확인

4. **비트 추가하기**
   - 16칸 그리드에서 원하는 위치 클릭
   - 8가지 악기 중 선택
   - 재생 버튼으로 미리듣기

5. **함께 완성하기**
   - 모든 참여자의 비트가 합쳐짐
   - 완성된 트랙 저장 및 공유

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO Client
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL (Railway) + Prisma ORM
- **Cache**: Redis (Railway)
- **Real-time**: Socket.IO
- **Authentication**: Google OAuth 2.0 (Passport.js)
- **Security**: Helmet, httpOnly Cookies
- **Deployment**: Railway

### Infrastructure
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **CI/CD**: Git Push → Auto Deploy

---

## 🔐 보안

- ✅ Google OAuth 2.0 인증
- ✅ Secure Cookie 설정
- ✅ Security Headers (Helmet)
- ✅ CORS 보호
- ✅ Rate Limiting
- ✅ Input Validation

---

## 📦 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm or yarn
- PostgreSQL
- Redis

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/tygwan/rhytheme.git
cd rhytheme

# 2. 프론트엔드 설정
npm install

# 3. 백엔드 설정
cd server
npm install

# 4. 환경 변수 설정
cp server/.env.example server/.env
# server/.env 파일을 열어서 값 입력

# 5. 데이터베이스 마이그레이션
cd server
npx prisma migrate dev

# 6. 개발 서버 실행
# 터미널 1: 백엔드
cd server
npm run dev

# 터미널 2: 프론트엔드
npm run dev
```

### 환경 변수 설정

**server/.env**:
```env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
JWT_SECRET="your-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"
SESSION_SECRET="your-session-secret"
FRONTEND_URL="http://localhost:3000"
PORT=3001
NODE_ENV=development
```

**.env.local** (프론트엔드):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## 🚀 배포 상태

### Production URLs
- **Frontend**: https://rhytheme-pjrwf5yg9-y01092042616-gmailcoms-projects.vercel.app
- **Backend**: https://rhytheme-production.up.railway.app
- **Health Check**: https://rhytheme-production.up.railway.app/api/health

### 배포 인프라
- **Vercel**: 프론트엔드 자동 배포 (main 브랜치)
- **Railway**: 백엔드 자동 배포 (main 브랜치)
- **PostgreSQL**: Railway Database
- **Redis**: Railway Redis

---

## 📊 개발 진행 상황

### ✅ 완료된 기능
- [x] M0: 프로젝트 초기 설정
- [x] M1: 에러 처리 시스템
- [x] M2: Google OAuth 인증
- [x] M3: 세션 관리 API
- [x] M4: 트랙 관리 API
- [x] M5: WebSocket 실시간 통신
- [x] M6: 턴제 대기열 시스템
- [x] 보안 강화 (Helmet, httpOnly Cookies)
- [x] Railway + Vercel 배포

### 🚧 개발 예정
- [ ] 프론트엔드 UI 구현
- [ ] 비트 그리드 시스템
- [ ] 오디오 재생 엔진
- [ ] 갤러리 기능
- [ ] 트랙 다운로드 기능

---

## 💡 자주 묻는 질문

**Q: 음악을 몰라도 할 수 있나요?**
> 네! 그리드를 클릭하면 바로 소리가 나고, 어떤 조합이든 음악이 됩니다.

**Q: 몇 명까지 참여할 수 있나요?**
> 세션당 최대 8명까지 참여 가능합니다.

**Q: 만든 음악을 저장할 수 있나요?**
> 네! 완성된 트랙은 저장하고 다운로드할 수 있습니다.

**Q: 회원가입이 필요한가요?**
> Google 계정으로 간편하게 로그인하실 수 있습니다.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

기여를 환영합니다! 버그 리포트, 기능 제안, Pull Request 모두 환영합니다.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact

- **Developer**: [@tygwan](https://github.com/tygwan)
- **Issues**: [GitHub Issues](https://github.com/tygwan/rhytheme/issues)
- **Email**: y01092042616@gmail.com

---

<div align="center">

**Made with rhythm by tygwan**

[⬆ Back to Top](#rhytheme)

</div>
