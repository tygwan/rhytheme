# Fix BeatSequencer Missing Instruments

## Meta
- **Created**: 2025-12-06 20:45
- **Last Updated**: 2025-12-06 20:45
- **Status**: ✅ COMPLETED
- **Related Docs**: dev-docs/CLAUDE.md, dev-docs/TODO.md (M0)

---

## Intent (의도)

### Why (왜 이 작업이 필요한가)
`BeatSequencer.tsx`에서 `snare`, `hihat`, `tom` 3개 악기가 선언되지 않아 런타임 에러 발생.
Line 50-52에서 Snare 선언이 깨져있고, HiHat과 Tom은 아예 없음.
Line 75에서 `[kick, snare, hihat, clap, tom, synth, bass, perc]` 참조하지만 undefined 변수 존재.

### Expected Outcome (기대 결과)
- 모든 8개 악기 (Kick, Snare, HiHat, Clap, Tom, Synth, Bass, Perc) 정상 초기화
- 비트 시퀀서에서 모든 악기 사운드 재생 가능
- 콘솔 에러 없이 정상 작동

### Decisions Made (결정 사항)
- 선택: Tone.js 내장 신시사이저 사용 (샘플 파일 불필요)
- 이유: 빠른 로딩, 의존성 최소화, 커스터마이징 용이

---

## Progress Tracking

### Tasks
- [x] Task 1: 버그 원인 분석 (snare, hihat, tom 미선언)
- [ ] Task 2: Snare 악기 선언 수정
- [ ] Task 3: HiHat 악기 추가
- [ ] Task 4: Tom 악기 추가
- [ ] Task 5: 코드 정리 및 들여쓰기 수정
- [ ] Task 6: 테스트 (8개 악기 모두 재생 확인)
- [ ] Task 7: Git 커밋

### Completed
(없음)

---

## Current Work

### Now Working On
**Task**: Task 2-5 - 악기 선언 수정
**Phase**: 🟢 GREEN
**Started**: 2025-12-06 20:45

### Context for Resume
현재 상태:
- BeatSequencer.tsx Line 49-52 분석 완료
- snare 변수 선언 코드가 깨져있음 (객체 리터럴만 남음)
- hihat, tom 변수 선언 자체가 없음

다음 단계:
- Line 49-75 영역 전체 수정
- snare = new Tone.NoiseSynth() 추가
- hihat = new Tone.MetalSynth() 추가
- tom = new Tone.MembraneSynth() 추가

작업 중인 파일:
- src/components/BeatSequencer.tsx (Line 38-86 영역)

---

## Changes Made

### Files Modified
| File | Change Type | Description |
|------|-------------|-------------|
| (작업 예정) | | |

### Code Changes Summary
(작업 후 업데이트)

---

## Notes

### Blockers / Issues
없음

### References
- Tone.js Docs: https://tonejs.github.io/
- 기존 코드의 다른 악기 패턴 참조

---

## Git Commit Draft

### Commit Message
```
fix(sequencer): add missing instrument declarations (snare, hihat, tom)

## Why
BeatSequencer에서 snare, hihat, tom 3개 악기가 미선언되어
런타임 에러 발생 및 해당 악기 사운드 재생 불가

## What
- Snare: NoiseSynth로 구현
- HiHat: MetalSynth로 구현
- Tom: MembraneSynth로 구현
- 코드 구조 정리 및 들여쓰기 수정

📋 Task: dev-docs/features/fix-beat-sequencer-instruments.md
```

### Files to Stage
- src/components/BeatSequencer.tsx
