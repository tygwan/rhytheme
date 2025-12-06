# Rhytheme - Implementation Plan (TDD-Driven)

## Version: 2.0
**Last Updated**: 2024-12-02
**Review Status**: Codex Validated
**Target Timeline**: 5 weeks (MVP)
**Scope**: Core collaborative beat-making platform (MVP)
**Team Size**: 1 (Solo Developer)

### Key Changes from v1.0
- ✅ Fixed: 시간 추정치 통일 (248h)
- ✅ Fixed: MVP 범위 축소 (M5 Gallery → v1.1 이월)
- ✅ Added: M0.5 테스트 인프라 설정
- ✅ Added: 누락 리스크 (오디오 정책, 모바일, 서버 검증)
- ✅ Improved: 1인 개발 기준 직렬 실행 구조

---

## Overview

Rhytheme은 턴제 방식의 협업 비트 제작 웹 플랫폼입니다. 참여자들이 순차적으로 비트를 추가하며 함께 음악을 만들어가는 서비스입니다.

**Development Philosophy**: Red → Green → Refactor → Commit

**Key Principles**:
- 실시간 동기화 안정성 우선
- 오디오 지연 최소화
- 직관적인 UX
- 테스트 주도 개발

**Success Criteria (MVP)**:
- 동시 접속 5명 이상 지원
- 기본 비트 시퀀서 동작
- 실시간 턴제 협업 가능
- 테스트 커버리지 70%+

**v1.1 Scope (Post-MVP)**:
- Dashboard/Gallery 페이지
- 좋아요/플레이 카운트
- 오디오 Export (WAV/MP3)
- 성능 최적화

---

## Dependency Graph

```
M0 (Critical Bug Fix) ← Blocker
  ↓
M0.5 (Test Infrastructure) ← NEW
  ↓
M1 (Database Setup)
  ↓
M2 (Authentication)
  ↓
M3 (Session & Track API)
  ↓
M4 (Real-time Enhancement)
  ↓
M5 (Testing & Polish)
  ↓
M6 (Deployment)

--- v1.1 (Post-MVP) ---
M7 (Dashboard & Gallery)
M8 (Audio Export)
```

**Critical Path**: M0 → M0.5 → M1 → M2 → M3 → M4 → M6
**MVP Duration**: 5 weeks (1인 직렬 실행)

---

## Milestones

### M0: Critical Bug Fix & Stabilization
**Priority**: P0 (Blocker)
**Duration**: 1 day | **Hours**: 8h

**Goal**: 런타임 에러 수정 및 기존 기능 안정화

**Test-First Approach**:
1. [RED] AudioEngine 8개 악기 초기화 테스트 작성
2. [GREEN] BeatSequencer.tsx 문법 오류 수정
3. [REFACTOR] 오디오 설정 상수/팩토리 추출
4. [COMMIT] 수정 커밋

**Deliverables**:
- [ ] BeatSequencer.tsx snare/hihat/tom 변수 선언 수정
- [ ] layout.tsx 메타데이터 업데이트 (Rhytheme)
- [ ] 환경 변수 설정 파일 생성
- [ ] 프로젝트 네이밍 통일 (Rhytheme)

**Dependencies**: None

**Risks**:
- 추가 버그 발견: Medium → 즉시 수정

---

### M0.5: Test Infrastructure Setup (NEW)
**Priority**: P0 (Critical)
**Duration**: 2 days | **Hours**: 16h

**Goal**: TDD 실행을 위한 테스트 프레임워크 구축

**Test-First Approach**:
1. [SETUP] Frontend 테스트 도구 설치
2. [RED] 샘플 컴포넌트 테스트 작성
3. [GREEN] 테스트 통과 확인
4. [SETUP] Backend 테스트 도구 설치
5. [RED] 샘플 API 테스트 작성
6. [GREEN] 테스트 통과 확인

**Deliverables**:
- [ ] Frontend: Vitest + @testing-library/react + msw
- [ ] Backend: Jest + ts-jest + supertest
- [ ] E2E: Playwright 기본 설정
- [ ] 테스트 스크립트 (npm test)
- [ ] 커버리지 리포트 설정
- [ ] CI 테스트 파이프라인 (GitHub Actions)

**Test Coverage Target**: 테스트 인프라 검증

**Dependencies**: M0

**Risks**:
- 설정 복잡도: Medium → 공식 문서 참조
- CI 환경 차이: Low → Docker 또는 GitHub Actions 표준 이미지

---

### M1: Database & Infrastructure Setup
**Priority**: P0 (Critical)
**Duration**: 3 days | **Hours**: 24h

**Goal**: PostgreSQL + Redis 연결 및 기본 인프라 구축

**Test-First Approach**:
1. [RED] DB 연결 테스트 작성
2. [GREEN] Prisma 설정 및 마이그레이션
3. [RED] Redis 연결 테스트 작성
4. [GREEN] Redis 클라이언트 구현
5. [RED] 헬스체크 테스트 작성
6. [GREEN] 헬스체크 엔드포인트 강화
7. [REFACTOR] 에러 핸들링 공통화
8. [COMMIT] 인프라 커밋

**Deliverables**:
- [ ] PostgreSQL 연결 설정
- [ ] Prisma 마이그레이션 실행
- [ ] Redis 클라이언트 설정
- [ ] 환경별 설정 관리 (dev/prod)
- [ ] 연결 헬스체크 엔드포인트
- [ ] 에러 핸들링 미들웨어
- [ ] 커스텀 에러 클래스

**Test Coverage Target**: 90%+ 인프라 코드

**Dependencies**: M0.5

**Risks**:
- DB 연결 실패: High → 로컬 Docker 폴백
- Redis 미사용: Medium → In-memory 임시 대체

---

### M2: Authentication System
**Priority**: P0 (Critical)
**Duration**: 5 days | **Hours**: 40h

**Goal**: JWT 기반 인증 시스템 구현

**Test-First Approach**:
1. [RED] 회원가입 유효성 검증 테스트
2. [GREEN] Zod 스키마 구현
3. [RED] 비밀번호 해싱 테스트
4. [GREEN] bcrypt 해싱 구현
5. [RED] 사용자 생성 테스트
6. [GREEN] User 서비스 구현
7. [RED] 로그인 테스트
8. [GREEN] 로그인 엔드포인트 구현
9. [RED] JWT 발급/검증 테스트
10. [GREEN] JWT 미들웨어 구현
11. [RED] 토큰 갱신 테스트
12. [GREEN] 리프레시 토큰 구현
13. [REFACTOR] 인증 로직 공통화
14. [COMMIT] 인증 커밋

**Deliverables**:
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh
- [ ] POST /api/auth/logout
- [ ] JWT 인증 미들웨어
- [ ] 비밀번호 해싱 (bcrypt)
- [ ] 프론트엔드 로그인/회원가입 UI

**Test Coverage Target**: 95%+ 인증 코드

**Dependencies**: M1

**Risks**:
- 보안 취약점: Critical → OWASP 가이드라인 준수
- 토큰 탈취: High → HttpOnly 쿠키 + Secure 플래그
- CSRF: High → CSRF 토큰 또는 SameSite 쿠키

---

### M3: Session & Track API
**Priority**: P0 (Critical)
**Duration**: 6 days | **Hours**: 48h

**Goal**: 세션/트랙 CRUD API 및 데이터 영속화

**Test-First Approach**:
1. [RED] 세션 생성 테스트 (유효성/권한/영속)
2. [GREEN] 세션 서비스/컨트롤러 구현
3. [RED] 세션 목록/상세 테스트
4. [GREEN] GET 엔드포인트 구현
5. [RED] 세션 권한 테스트 (owner only)
6. [GREEN] 권한 미들웨어 구현
7. [RED] 트랙 저장 테스트
8. [GREEN] 트랙 서비스 구현
9. [RED] In-memory → DB 마이그레이션 테스트
10. [GREEN] SessionService DB 백엔드 전환
11. [REFACTOR] 에러 핸들링/응답 포맷 공통화
12. [COMMIT] API 커밋

**Deliverables**:
- [ ] POST /api/sessions
- [ ] GET /api/sessions
- [ ] GET /api/sessions/:id
- [ ] DELETE /api/sessions/:id
- [ ] POST /api/tracks
- [ ] GET /api/tracks
- [ ] In-memory → DB 마이그레이션
- [ ] Zod 요청 검증

**Test Coverage Target**: 85%+ API 코드

**Dependencies**: M1, M2

**Risks**:
- 데이터 무결성: High → 트랜잭션 활용
- API 복잡도: Medium → 명확한 인터페이스 설계

---

### M4: Real-time Enhancement
**Priority**: P1 (High)
**Duration**: 5 days | **Hours**: 40h

**Goal**: WebSocket 기능 강화 및 서버 측 턴 검증

**Test-First Approach**:
1. [RED] 서버 측 턴 검증 테스트
2. [GREEN] beat-update 핸들러에 검증 추가
3. [RED] 턴 타임아웃 테스트 (30초)
4. [GREEN] 서버 타이머 구현
5. [RED] BPM 동기화 테스트
6. [GREEN] BPM 브로드캐스트 구현
7. [RED] 연결 복구 테스트
8. [GREEN] 재연결 로직 구현
9. [RED] Redis pub/sub 테스트
10. [GREEN] Socket.io Redis 어댑터 구현
11. [REFACTOR] WebSocket 이벤트 핸들러 분리
12. [COMMIT] 실시간 커밋

**Deliverables**:
- [ ] 서버 측 턴 검증 (currentTurn === socket.id)
- [ ] 턴 타임아웃 (30초) 서버 구현
- [ ] BPM 변경 실시간 동기화
- [ ] 연결 끊김 시 자동 복구
- [ ] Redis pub/sub 기반 확장
- [ ] 실시간 활동 로그

**Test Coverage Target**: 80%+ WebSocket 코드

**Dependencies**: M1, M3

**Risks**:
- 동시성 이슈: High → Redis 기반 분산 락
- 네트워크 지연: Medium → 낙관적 업데이트
- 브라우저 오디오 정책: High → 사용자 제스처 후 재생 (아래 상세)

---

### M5: Testing & Polish
**Priority**: P1 (High)
**Duration**: 4 days | **Hours**: 32h

**Goal**: 종합 테스트 및 안정화

**Deliverables**:
- [ ] Unit 테스트 보완 (70%+ 달성)
- [ ] Integration 테스트
- [ ] E2E 테스트 (Playwright)
  - 세션 생성 → 참여 → 턴 전환 → 비트 업데이트
- [ ] 에러 바운더리 추가
- [ ] 로딩 상태 UI
- [ ] 오디오 자동재생 정책 대응 (사용자 클릭 후 AudioContext 시작)

**Test Coverage Target**: 전체 70%+

**Dependencies**: M3, M4

---

### M6: Deployment & Operations
**Priority**: P1 (High)
**Duration**: 3 days | **Hours**: 24h

**Goal**: 프로덕션 배포 및 운영 환경 구축

**Deliverables**:
- [ ] Vercel 프론트엔드 배포
- [ ] Railway 백엔드 배포
- [ ] PostgreSQL (Railway)
- [ ] Redis (Railway 또는 Upstash)
- [ ] 환경 변수 설정
- [ ] 도메인 연결 (선택)
- [ ] 기본 모니터링
- [ ] 배포 문서화

**Dependencies**: M5

**Risks**:
- 배포 실패: Medium → 롤백 절차 준비
- 환경 차이: Medium → 프리뷰 배포 먼저 테스트

---

## v1.1 Milestones (Post-MVP)

### M7: Dashboard & Gallery
**Duration**: 4 days | **Hours**: 32h

- 갤러리 페이지 (/dashboard)
- 트랙 카드 컴포넌트
- 좋아요/플레이 카운트
- 필터링 (최신순/인기순)

### M8: Audio Export & Enhancement
**Duration**: 3 days | **Hours**: 24h

- WAV/MP3 Export
- 오디오 이펙트 추가
- 성능 최적화

---

## Risk Analysis

### Technical Risks (Updated)

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **브라우저 오디오 정책** | High | High | 사용자 제스처(클릭) 후 AudioContext.resume() |
| **모바일 Web Audio 지연** | High | Medium | 낮은 버퍼 사이즈, 터치 이벤트 최적화 |
| **서버 턴 검증 부재** | Critical | - | M4에서 서버 측 검증 필수 구현 |
| WebSocket 확장성 | High | Medium | Redis pub/sub 도입 |
| DB 마이그레이션 | Medium | Low | 백업 및 롤백 준비 |
| **동시성/레이스 조건** | High | Medium | Redis 분산 락, 트랜잭션 |

### Schedule Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| 예상보다 복잡한 기능 | High | High | 20% 버퍼 시간 확보 |
| 테스트 작성 지연 | Medium | Medium | TDD 사이클 엄격 준수 |
| 외부 서비스 장애 | Medium | Low | 폴백 전략 준비 |

### Test Strategy Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Web Audio 테스트 어려움 | Medium | High | AudioEngine 어댑터 분리 후 목킹 |
| Socket 테스트 복잡도 | Medium | Medium | socket.io-client로 통합 테스트 |
| E2E 테스트 불안정 | Medium | Medium | 재시도 로직, headless 모드 |

---

## Timeline & Resources

**Total Duration**: 5 weeks (realistic)
**Buffer**: 20% (~5 days)
**Team**: 1 developer (Solo)
**Total Estimated Hours**: ~248h

### Milestone Schedule (Updated)

| Milestone | Duration | Week | Hours | Priority |
|-----------|----------|------|-------|----------|
| M0 | 1d | 1 | 8h | P0 |
| M0.5 | 2d | 1 | 16h | P0 |
| M1 | 3d | 1-2 | 24h | P0 |
| M2 | 5d | 2 | 40h | P0 |
| M3 | 6d | 3 | 48h | P0 |
| M4 | 5d | 4 | 40h | P1 |
| M5 | 4d | 4-5 | 32h | P1 |
| M6 | 3d | 5 | 24h | P1 |
| **Buffer** | 5d | - | 40h | - |
| **MVP Total** | **34d** | **~7w** | **272h** | - |

### v1.1 (Post-MVP)
| M7 | 4d | - | 32h | P2 |
| M8 | 3d | - | 24h | P2 |

---

## Quality Gates

### Per-Milestone Gates
- [ ] 모든 테스트 통과 (RED→GREEN 완료)
- [ ] 커버리지 목표 달성
- [ ] 코드 리뷰 완료 (셀프)
- [ ] 문서 업데이트

### MVP Production Gates
- [ ] 전체 테스트 커버리지 70%+
- [ ] 보안 취약점 없음
- [ ] E2E 핵심 시나리오 통과
- [ ] 서버 측 턴 검증 구현

---

## Notes

### Encoding
- 모든 파일 UTF-8 인코딩 확인
- 프로젝트명 "Rhytheme"로 통일

### Assumptions
- 1인 개발자 평일 기준 (5일/주)
- 외부 DB 서비스 사용 (Railway/Supabase)
- MCP 서버 (Vercel, Railway) 연결됨

### Constraints
- Solo 개발자로 병렬 작업 불가
- 무료 티어 서비스 활용 (초기)

---

## Approval

**Plan Prepared By**: Claude Code
**Review Date**: 2024-12-02
**Codex Validation**: ✅ Passed
**Status**: Ready for Execution
