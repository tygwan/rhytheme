# Rhytheme - Task List (TDD-Driven)

## Version: 2.0
**Last Updated**: 2024-12-02
**Status**: Ready for Execution
**Based on**: PLAN.md v2.0 (Codex Validated)
**Total Tasks**: 180+ tasks (MVP)
**Total Estimated Time**: ~248h (5 weeks solo + buffer)

### Key Changes from v1.0
- Added: M0.5 Test Infrastructure tasks
- Moved: M5 Gallery -> v1.1 (Post-MVP)
- Renumbered: M5 Testing, M6 Deploy (MVP scope)
- Added: Browser audio policy handling tasks
- Added: Server-side turn validation tasks

---

## Task Format Guide

```
- [ ] Task description (X.Xh) [CATEGORY] {Milestone}
```

### Categories
| Tag | Purpose |
|-----|---------|
| `[RED]` | Write failing test |
| `[GREEN]` | Implement to pass test |
| `[REFACTOR]` | Improve code structure |
| `[COMMIT]` | Git commit |
| `[DOC]` | Documentation |
| `[SETUP]` | Configuration/Setup |
| `[INT]` | Integration test |
| `[E2E]` | End-to-end test |

---

## M0: Critical Bug Fix & Stabilization
**Duration**: 1 day | **Total**: 8h
**Priority**: P0 (Blocker)

### Bug Fixes (4h)
- [ ] Read BeatSequencer.tsx and identify snare variable issue (0.5h) [RED] {M0}
- [ ] Fix snare instrument declaration in BeatSequencer (1.0h) [GREEN] {M0}
- [ ] Verify all 8 instruments initialize correctly (0.5h) [GREEN] {M0}
- [ ] Test audio playback for all instruments (1.0h) [INT] {M0}
- [ ] Commit: "fix(sequencer): resolve snare variable declaration" (0.5h) [COMMIT] {M0}

### Metadata & Config (2.5h)
- [ ] Update layout.tsx metadata (title, description) (0.5h) [GREEN] {M0}
- [ ] Create .env.local template for frontend (0.5h) [SETUP] {M0}
- [ ] Create server/.env.example with all variables (0.5h) [SETUP] {M0}
- [ ] Verify environment variables load correctly (0.5h) [INT] {M0}
- [ ] Commit: "chore: add environment configuration" (0.5h) [COMMIT] {M0}

### Verification (1.5h)
- [ ] Run frontend dev server and verify landing page (0.5h) [INT] {M0}
- [ ] Run backend server and verify health endpoint (0.5h) [INT] {M0}
- [ ] Test WebSocket connection between frontend/backend (0.5h) [INT] {M0}

**M0 Subtotal**: 8h

---

## M0.5: Test Infrastructure Setup (NEW)
**Duration**: 2 days | **Total**: 16h
**Priority**: P0 (Critical)

### Frontend Test Setup (6h)
- [ ] Install Vitest and configure vitest.config.ts (1.0h) [SETUP] {M0.5}
- [ ] Install @testing-library/react and @testing-library/jest-dom (0.5h) [SETUP] {M0.5}
- [ ] Install msw for API mocking (0.5h) [SETUP] {M0.5}
- [ ] Configure test environment for React 19 (1.0h) [SETUP] {M0.5}
- [ ] Write sample component test (Button or simple component) (1.0h) [RED] {M0.5}
- [ ] Verify test passes (0.5h) [GREEN] {M0.5}
- [ ] Add npm test:frontend script (0.5h) [SETUP] {M0.5}
- [ ] Commit: "test(frontend): setup Vitest with testing-library" (0.5h) [COMMIT] {M0.5}

### Backend Test Setup (5h)
- [ ] Install Jest and ts-jest (0.5h) [SETUP] {M0.5}
- [ ] Configure jest.config.js for TypeScript (1.0h) [SETUP] {M0.5}
- [ ] Install supertest for HTTP testing (0.5h) [SETUP] {M0.5}
- [ ] Write sample API test (health endpoint) (1.0h) [RED] {M0.5}
- [ ] Verify test passes (0.5h) [GREEN] {M0.5}
- [ ] Add npm test:backend script (0.5h) [SETUP] {M0.5}
- [ ] Commit: "test(backend): setup Jest with supertest" (0.5h) [COMMIT] {M0.5}

### E2E & CI Setup (5h)
- [ ] Install Playwright (0.5h) [SETUP] {M0.5}
- [ ] Configure playwright.config.ts (1.0h) [SETUP] {M0.5}
- [ ] Write sample E2E test (landing page loads) (1.0h) [E2E] {M0.5}
- [ ] Configure coverage reporting (lcov) (0.5h) [SETUP] {M0.5}
- [ ] Create GitHub Actions workflow for CI (1.0h) [SETUP] {M0.5}
- [ ] Test CI pipeline runs tests (0.5h) [INT] {M0.5}
- [ ] Commit: "ci: add test infrastructure and GitHub Actions" (0.5h) [COMMIT] {M0.5}

**M0.5 Subtotal**: 16h

---

## M1: Database & Infrastructure Setup
**Duration**: 3 days | **Total**: 24h
**Priority**: P0 (Critical)

### PostgreSQL Setup (8h)
- [ ] Write test for database connection (1.0h) [RED] {M1}
- [ ] Configure Prisma database URL from env (1.0h) [GREEN] {M1}
- [ ] Run initial Prisma migration (1.0h) [SETUP] {M1}
- [ ] Write test for User model CRUD (1.0h) [RED] {M1}
- [ ] Verify User model operations (1.0h) [GREEN] {M1}
- [ ] Write test for Session model CRUD (1.0h) [RED] {M1}
- [ ] Verify Session model operations (1.0h) [GREEN] {M1}
- [ ] Commit: "feat(db): setup PostgreSQL with Prisma" (0.5h) [COMMIT] {M1}

### Redis Setup (6h)
- [ ] Install and configure ioredis client (0.5h) [SETUP] {M1}
- [ ] Write test for Redis connection (1.0h) [RED] {M1}
- [ ] Implement Redis connection manager (1.0h) [GREEN] {M1}
- [ ] Write test for session state storage in Redis (1.0h) [RED] {M1}
- [ ] Implement session state caching (1.5h) [GREEN] {M1}
- [ ] Commit: "feat(cache): setup Redis for session state" (0.5h) [COMMIT] {M1}

### Error Handling (5h)
- [ ] Write test for custom error classes (0.5h) [RED] {M1}
- [ ] Implement ValidationError, AuthError, NotFoundError (1.0h) [GREEN] {M1}
- [ ] Write test for error handler middleware (0.5h) [RED] {M1}
- [ ] Implement global error handler middleware (1.0h) [GREEN] {M1}
- [ ] Write test for async error wrapper (0.5h) [RED] {M1}
- [ ] Implement asyncHandler utility (0.5h) [GREEN] {M1}
- [ ] Commit: "feat(core): add error handling framework" (0.5h) [COMMIT] {M1}

### Health Check Enhancement (3h)
- [ ] Write test for comprehensive health check (0.5h) [RED] {M1}
- [ ] Implement DB connection check in health endpoint (0.5h) [GREEN] {M1}
- [ ] Implement Redis connection check in health endpoint (0.5h) [GREEN] {M1}
- [ ] Add response time metrics to health check (0.5h) [GREEN] {M1}
- [ ] Integration test for all health checks (0.5h) [INT] {M1}
- [ ] Commit: "feat(api): enhance health check endpoint" (0.5h) [COMMIT] {M1}

### Documentation (2h)
- [ ] Document database schema and relationships (1.0h) [DOC] {M1}
- [ ] Document environment setup for contributors (1.0h) [DOC] {M1}

**M1 Subtotal**: 24h

---

## M2: Authentication System
**Duration**: 5 days | **Total**: 40h
**Priority**: P0 (Critical)

### User Registration (10h)
- [ ] Write test for registration validation (email, password) (1.0h) [RED] {M2}
- [ ] Implement Zod validation schema for registration (1.0h) [GREEN] {M2}
- [ ] Write test for password hashing (1.0h) [RED] {M2}
- [ ] Implement bcrypt password hashing (1.0h) [GREEN] {M2}
- [ ] Write test for user creation in DB (1.0h) [RED] {M2}
- [ ] Implement user creation service (1.5h) [GREEN] {M2}
- [ ] Write test for duplicate email handling (0.5h) [RED] {M2}
- [ ] Handle duplicate email error (0.5h) [GREEN] {M2}
- [ ] Implement POST /api/auth/register endpoint (1.0h) [GREEN] {M2}
- [ ] Commit: "feat(auth): add user registration" (0.5h) [COMMIT] {M2}

### User Login (8h)
- [ ] Write test for login validation (1.0h) [RED] {M2}
- [ ] Implement login validation schema (0.5h) [GREEN] {M2}
- [ ] Write test for password comparison (1.0h) [RED] {M2}
- [ ] Implement password verification (0.5h) [GREEN] {M2}
- [ ] Write test for JWT token generation (1.0h) [RED] {M2}
- [ ] Implement JWT token generation (1.0h) [GREEN] {M2}
- [ ] Write test for invalid credentials handling (0.5h) [RED] {M2}
- [ ] Handle invalid credentials error (0.5h) [GREEN] {M2}
- [ ] Implement POST /api/auth/login endpoint (1.0h) [GREEN] {M2}
- [ ] Commit: "feat(auth): add user login" (0.5h) [COMMIT] {M2}

### JWT Middleware (8h)
- [ ] Write test for JWT verification (1.0h) [RED] {M2}
- [ ] Implement JWT verification utility (1.0h) [GREEN] {M2}
- [ ] Write test for auth middleware (1.0h) [RED] {M2}
- [ ] Implement auth middleware (1.5h) [GREEN] {M2}
- [ ] Write test for expired token handling (0.5h) [RED] {M2}
- [ ] Handle expired token error (0.5h) [GREEN] {M2}
- [ ] Write test for token refresh (1.0h) [RED] {M2}
- [ ] Implement POST /api/auth/refresh endpoint (1.0h) [GREEN] {M2}
- [ ] Commit: "feat(auth): add JWT middleware" (0.5h) [COMMIT] {M2}

### Frontend Auth UI (10h)
- [ ] Create LoginForm component (2.0h) [GREEN] {M2}
- [ ] Create RegisterForm component (2.0h) [GREEN] {M2}
- [ ] Implement useAuth hook for auth state (1.5h) [GREEN] {M2}
- [ ] Create /login page (1.0h) [GREEN] {M2}
- [ ] Create /register page (1.0h) [GREEN] {M2}
- [ ] Add auth state to navigation (1.0h) [GREEN] {M2}
- [ ] Test login/register flow E2E (1.0h) [E2E] {M2}
- [ ] Commit: "feat(ui): add authentication pages" (0.5h) [COMMIT] {M2}

### Auth Documentation (4h)
- [ ] Document authentication flow (1.5h) [DOC] {M2}
- [ ] Document API endpoints (1.5h) [DOC] {M2}
- [ ] Add auth examples to README (1.0h) [DOC] {M2}

**M2 Subtotal**: 40h

---

## M3: Session & Track API
**Duration**: 6 days | **Total**: 48h
**Priority**: P0 (Critical)

### Session CRUD API (16h)
- [ ] Write test for session creation (1.0h) [RED] {M3}
- [ ] Implement session creation service (1.5h) [GREEN] {M3}
- [ ] Implement POST /api/sessions endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for session listing (1.0h) [RED] {M3}
- [ ] Implement GET /api/sessions endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for session detail (1.0h) [RED] {M3}
- [ ] Implement GET /api/sessions/:id endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for session update (1.0h) [RED] {M3}
- [ ] Implement PATCH /api/sessions/:id endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for session deletion (1.0h) [RED] {M3}
- [ ] Implement DELETE /api/sessions/:id endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for session authorization (owner only) (1.0h) [RED] {M3}
- [ ] Implement session authorization middleware (1.0h) [GREEN] {M3}
- [ ] Integration tests for session API (1.0h) [INT] {M3}
- [ ] Commit: "feat(api): add session CRUD endpoints" (0.5h) [COMMIT] {M3}

### Track API (12h)
- [ ] Write test for track creation (1.0h) [RED] {M3}
- [ ] Implement track creation service (1.5h) [GREEN] {M3}
- [ ] Implement POST /api/tracks endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for track listing (1.0h) [RED] {M3}
- [ ] Implement GET /api/tracks endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for track detail (1.0h) [RED] {M3}
- [ ] Implement GET /api/tracks/:id endpoint (1.0h) [GREEN] {M3}
- [ ] Write test for track like functionality (1.0h) [RED] {M3}
- [ ] Implement POST /api/tracks/:id/like endpoint (1.0h) [GREEN] {M3}
- [ ] Integration tests for track API (1.0h) [INT] {M3}
- [ ] Commit: "feat(api): add track endpoints" (0.5h) [COMMIT] {M3}

### Data Migration (8h)
- [ ] Write test for in-memory to DB migration (1.0h) [RED] {M3}
- [ ] Implement SessionService with DB backend (2.0h) [GREEN] {M3}
- [ ] Update WebSocket handlers to use SessionService (2.0h) [GREEN] {M3}
- [ ] Write test for data persistence across restarts (1.0h) [INT] {M3}
- [ ] Verify beat data saves correctly to DB (1.0h) [INT] {M3}
- [ ] Commit: "refactor: migrate to database persistence" (0.5h) [COMMIT] {M3}

### API Validation (6h)
- [ ] Write test for request body validation (1.0h) [RED] {M3}
- [ ] Implement Zod schemas for all endpoints (2.0h) [GREEN] {M3}
- [ ] Write test for query parameter validation (1.0h) [RED] {M3}
- [ ] Implement query validation middleware (1.0h) [GREEN] {M3}
- [ ] Commit: "feat(api): add request validation" (0.5h) [COMMIT] {M3}

### API Documentation (6h)
- [ ] Document all API endpoints (2.0h) [DOC] {M3}
- [ ] Create API examples with curl (1.5h) [DOC] {M3}
- [ ] Add OpenAPI/Swagger spec (2.0h) [DOC] {M3}
- [ ] Commit: "docs: add API documentation" (0.5h) [COMMIT] {M3}

**M3 Subtotal**: 48h

---

## M4: Real-time Enhancement
**Duration**: 5 days | **Total**: 40h
**Priority**: P1 (High)

### Server-Side Turn Validation (6h) - NEW
- [ ] Write test for server-side turn validation (1.0h) [RED] {M4}
- [ ] Implement turn validation in beat-update handler (1.5h) [GREEN] {M4}
- [ ] Write test for invalid turn rejection (0.5h) [RED] {M4}
- [ ] Implement error response for invalid turn (0.5h) [GREEN] {M4}
- [ ] Write test for turn order enforcement (1.0h) [RED] {M4}
- [ ] Verify only current turn user can update (1.0h) [INT] {M4}
- [ ] Commit: "feat(realtime): add server-side turn validation" (0.5h) [COMMIT] {M4}

### Turn Timeout (10h)
- [ ] Write test for turn timeout logic (30 seconds) (1.5h) [RED] {M4}
- [ ] Implement server-side turn timer (2.0h) [GREEN] {M4}
- [ ] Write test for auto-pass on timeout (1.0h) [RED] {M4}
- [ ] Implement auto-pass functionality (1.5h) [GREEN] {M4}
- [ ] Write test for timeout cancellation on action (1.0h) [RED] {M4}
- [ ] Implement timeout reset on beat update (1.0h) [GREEN] {M4}
- [ ] Update frontend to show accurate countdown (1.5h) [GREEN] {M4}
- [ ] Integration test for turn timeout (1.5h) [INT] {M4}
- [ ] Commit: "feat(realtime): add turn timeout" (0.5h) [COMMIT] {M4}

### BPM Sync (8h)
- [ ] Write test for BPM change broadcast (1.0h) [RED] {M4}
- [ ] Implement BPM sync WebSocket event (1.5h) [GREEN] {M4}
- [ ] Write test for BPM persistence (1.0h) [RED] {M4}
- [ ] Save BPM to session state (1.0h) [GREEN] {M4}
- [ ] Update frontend BPM control to sync (1.5h) [GREEN] {M4}
- [ ] Integration test for BPM sync (1.0h) [INT] {M4}
- [ ] Commit: "feat(realtime): add BPM synchronization" (0.5h) [COMMIT] {M4}

### Connection Recovery (10h)
- [ ] Write test for reconnection handling (1.5h) [RED] {M4}
- [ ] Implement reconnection logic with state recovery (2.0h) [GREEN] {M4}
- [ ] Write test for queue position preservation (1.0h) [RED] {M4}
- [ ] Implement queue position recovery (1.5h) [GREEN] {M4}
- [ ] Add connection status indicator to UI (1.5h) [GREEN] {M4}
- [ ] Write test for graceful disconnect (1.0h) [RED] {M4}
- [ ] Implement graceful disconnect handling (1.0h) [GREEN] {M4}
- [ ] Commit: "feat(realtime): add connection recovery" (0.5h) [COMMIT] {M4}

### Redis Pub/Sub (8h)
- [ ] Write test for Redis pub/sub setup (1.0h) [RED] {M4}
- [ ] Implement Redis adapter for Socket.io (2.0h) [GREEN] {M4}
- [ ] Write test for multi-instance sync (1.0h) [RED] {M4}
- [ ] Verify events propagate across instances (1.5h) [INT] {M4}
- [ ] Document scaling architecture (1.5h) [DOC] {M4}
- [ ] Commit: "feat(realtime): add Redis pub/sub" (0.5h) [COMMIT] {M4}

### Activity Log (2h)
- [ ] Implement real-time activity log events (1.0h) [GREEN] {M4}
- [ ] Update QueuePanel to show live activities (0.5h) [GREEN] {M4}
- [ ] Commit: "feat(ui): add real-time activity log" (0.5h) [COMMIT] {M4}

**M4 Subtotal**: 40h

---

## M5: Testing & Polish
**Duration**: 4 days | **Total**: 32h
**Priority**: P1 (High)

### Gallery Page (12h)
- [ ] Create TrackCard component (2.0h) [GREEN] {M5}
- [ ] Write test for track grid rendering (1.0h) [RED] {M5}
- [ ] Create responsive track grid layout (2.0h) [GREEN] {M5}
- [ ] Implement /dashboard page (2.0h) [GREEN] {M5}
- [ ] Add loading skeleton UI (1.0h) [GREEN] {M5}
- [ ] Add empty state UI (1.0h) [GREEN] {M5}
- [ ] Write test for pagination/infinite scroll (1.0h) [RED] {M5}
- [ ] Implement infinite scroll (1.5h) [GREEN] {M5}
- [ ] Commit: "feat(ui): add dashboard gallery page" (0.5h) [COMMIT] {M5}

### Track Playback (8h)
- [ ] Write test for track playback (1.0h) [RED] {M5}
- [ ] Implement track player component (2.0h) [GREEN] {M5}
- [ ] Add play/pause controls to TrackCard (1.0h) [GREEN] {M5}
- [ ] Implement play count increment API call (1.0h) [GREEN] {M5}
- [ ] Add waveform visualization (optional) (2.0h) [GREEN] {M5}
- [ ] Commit: "feat(ui): add track playback" (0.5h) [COMMIT] {M5}

### Like System (6h)
- [ ] Write test for like toggle (1.0h) [RED] {M5}
- [ ] Implement like button component (1.0h) [GREEN] {M5}
- [ ] Add optimistic UI update for likes (1.0h) [GREEN] {M5}
- [ ] Show like count on TrackCard (0.5h) [GREEN] {M5}
- [ ] Write test for user's liked tracks (1.0h) [RED] {M5}
- [ ] Add "My Likes" filter option (1.0h) [GREEN] {M5}
- [ ] Commit: "feat(ui): add like functionality" (0.5h) [COMMIT] {M5}

### Filtering & Sorting (4h)
- [ ] Add filter controls (newest, popular, my tracks) (1.5h) [GREEN] {M5}
- [ ] Implement sorting API parameters (1.0h) [GREEN] {M5}
- [ ] Add URL-based filter state (1.0h) [GREEN] {M5}
- [ ] Commit: "feat(ui): add gallery filters" (0.5h) [COMMIT] {M5}

### E2E Tests (2h)
- [ ] Write E2E test for gallery browsing (1.0h) [E2E] {M5}
- [ ] Write E2E test for track playback (0.5h) [E2E] {M5}
- [ ] Commit: "test: add gallery E2E tests" (0.5h) [COMMIT] {M5}

**M5 Subtotal**: 32h

---

## M6: Testing & Polish
**Duration**: 4 days | **Total**: 32h
**Priority**: P1 (High)

### Unit Test Coverage (10h)
- [ ] Add missing tests for utility functions (2.0h) [RED] {M6}
- [ ] Add missing tests for hooks (2.0h) [RED] {M6}
- [ ] Add missing tests for services (2.0h) [RED] {M6}
- [ ] Add missing tests for middleware (2.0h) [RED] {M6}
- [ ] Verify 80%+ coverage achieved (1.0h) [INT] {M6}
- [ ] Commit: "test: improve unit test coverage" (0.5h) [COMMIT] {M6}

### E2E Test Suite (8h)
- [ ] Setup Playwright configuration (1.0h) [SETUP] {M6}
- [ ] Write E2E test for full user journey (2.0h) [E2E] {M6}
- [ ] Write E2E test for session creation flow (1.5h) [E2E] {M6}
- [ ] Write E2E test for collaborative session (2.0h) [E2E] {M6}
- [ ] Write E2E test for track saving (1.0h) [E2E] {M6}
- [ ] Commit: "test: add E2E test suite" (0.5h) [COMMIT] {M6}

### Performance Optimization (6h)
- [ ] Audit bundle size with webpack-bundle-analyzer (1.0h) [INT] {M6}
- [ ] Implement code splitting for routes (1.5h) [GREEN] {M6}
- [ ] Optimize image loading (1.0h) [GREEN] {M6}
- [ ] Add memo/useMemo to expensive components (1.0h) [REFACTOR] {M6}
- [ ] Run Lighthouse audit and fix issues (1.0h) [INT] {M6}
- [ ] Commit: "perf: optimize bundle and rendering" (0.5h) [COMMIT] {M6}

### UI Polish (6h)
- [ ] Add error boundaries to key components (1.5h) [GREEN] {M6}
- [ ] Add loading states to all async operations (1.5h) [GREEN] {M6}
- [ ] Improve mobile responsiveness (1.5h) [GREEN] {M6}
- [ ] Add keyboard shortcuts for sequencer (1.0h) [GREEN] {M6}
- [ ] Commit: "feat(ui): add polish and error handling" (0.5h) [COMMIT] {M6}

### Accessibility (2h)
- [ ] Add ARIA labels to interactive elements (1.0h) [GREEN] {M6}
- [ ] Test keyboard navigation (0.5h) [INT] {M6}
- [ ] Commit: "a11y: improve accessibility" (0.5h) [COMMIT] {M6}

**M6 Subtotal**: 32h

---

## M7: Deployment & Operations
**Duration**: 3 days | **Total**: 24h
**Priority**: P1 (High)

### Vercel Deployment (8h)
- [ ] Configure vercel.json (1.0h) [SETUP] {M7}
- [ ] Set production environment variables (1.0h) [SETUP] {M7}
- [ ] Deploy to Vercel preview (1.0h) [SETUP] {M7}
- [ ] Test preview deployment (1.0h) [INT] {M7}
- [ ] Deploy to production (1.0h) [SETUP] {M7}
- [ ] Configure custom domain (if available) (1.0h) [SETUP] {M7}
- [ ] Verify production deployment (1.0h) [INT] {M7}
- [ ] Commit: "deploy: frontend to Vercel" (0.5h) [COMMIT] {M7}

### Railway Deployment (8h)
- [ ] Configure railway.json (1.0h) [SETUP] {M7}
- [ ] Set production environment variables (1.0h) [SETUP] {M7}
- [ ] Configure PostgreSQL on Railway (1.0h) [SETUP] {M7}
- [ ] Configure Redis on Railway (1.0h) [SETUP] {M7}
- [ ] Deploy backend to Railway (1.0h) [SETUP] {M7}
- [ ] Run Prisma migrations on production (0.5h) [SETUP] {M7}
- [ ] Test backend API in production (1.0h) [INT] {M7}
- [ ] Commit: "deploy: backend to Railway" (0.5h) [COMMIT] {M7}

### CI/CD & Monitoring (6h)
- [ ] Setup GitHub Actions for CI (1.5h) [SETUP] {M7}
- [ ] Add automatic deployment on merge (1.0h) [SETUP] {M7}
- [ ] Configure basic error monitoring (1.0h) [SETUP] {M7}
- [ ] Add uptime monitoring (0.5h) [SETUP] {M7}
- [ ] Test full CI/CD pipeline (1.0h) [INT] {M7}
- [ ] Commit: "ci: add CI/CD pipeline" (0.5h) [COMMIT] {M7}

### Documentation (2h)
- [ ] Update README with production URLs (0.5h) [DOC] {M7}
- [ ] Document deployment process (1.0h) [DOC] {M7}
- [ ] Commit: "docs: update deployment documentation" (0.5h) [COMMIT] {M7}

**M7 Subtotal**: 24h

---

## Summary

### By Milestone

| Milestone | Tasks | Hours | Duration | Priority |
|-----------|-------|-------|----------|----------|
| M0 | 13 | 8h | 1d | P0 |
| M1 | 24 | 24h | 3d | P0 |
| M2 | 32 | 40h | 5d | P0 |
| M3 | 36 | 48h | 6d | P0 |
| M4 | 28 | 40h | 5d | P1 |
| M5 | 22 | 32h | 4d | P1 |
| M6 | 24 | 32h | 4d | P1 |
| M7 | 22 | 24h | 3d | P1 |
| **Total** | **201** | **248h** | **31d** | - |

### By Category

| Category | Count | Purpose |
|----------|-------|---------|
| [RED] | ~60 | Write failing tests |
| [GREEN] | ~80 | Implementation |
| [REFACTOR] | ~5 | Code improvement |
| [COMMIT] | ~25 | Git commits |
| [INT] | ~20 | Integration tests |
| [E2E] | ~8 | End-to-end tests |
| [DOC] | ~15 | Documentation |
| [SETUP] | ~20 | Configuration |

---

## Execution Order

### Week 1: Foundation
- **Day 1**: M0 (Bug fixes)
- **Day 2-4**: M1 (Database setup)
- **Day 5-7**: M2 start (Auth)

### Week 2: Auth & API
- **Day 1-3**: M2 complete (Auth)
- **Day 4-7**: M3 start (Session API)

### Week 3: API & Real-time
- **Day 1-2**: M3 complete (Track API)
- **Day 3-7**: M4 (Real-time)

### Week 4: Polish & Deploy
- **Day 1-3**: M5 (Dashboard)
- **Day 4-5**: M6 (Testing)
- **Day 6-7**: M7 (Deployment)

---

## Quality Gates

### Per-Task
- [ ] Test passes (for [RED] tasks)
- [ ] Implementation passes test (for [GREEN])
- [ ] Commit message follows convention

### Per-Milestone
- [ ] All tasks completed
- [ ] Coverage target met
- [ ] Integration tests pass

### Production
- [ ] 80%+ test coverage
- [ ] All E2E tests pass
- [ ] Performance requirements met

---

## Progress Tracking

Use checkboxes to track completion:
- `[ ]` = Pending
- `[x]` = Completed

Update `Last Updated` date when making changes.

---

**Prepared By**: Claude Code
**Date**: 2024-12-02
**Status**: Ready for Execution
