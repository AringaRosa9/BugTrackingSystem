# Bug Tracking System Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the demo into clear `frontend` and `backend` apps, wire ingest through a real API-backed bug list, render per-bug evidence dynamically, and compute dashboard metrics from live bug data.

**Architecture:** Move the React app into `frontend/` and the Express API into `backend/`, with the backend owning the bug data source and transformation helpers. The frontend fetches `/api/bugs`, stores bugs in app state, derives dashboard metrics from that state, and renders bug-detail logs/timeline from the selected bug instead of global mock constants.

**Tech Stack:** React 19, Vite 6, TypeScript, Express 4, tsx

---

### Task 1: Restructure The Repository

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/index.html`
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/server.ts`
- Create: `backend/src/data/mockBugs.json`
- Create: `backend/src/types/bug.ts`
- Create: `backend/src/services/bugStore.ts`
- Modify: `README.md`
- Modify: `.gitignore`

- [ ] Move frontend-only source files into `frontend/`.
- [ ] Move backend-only source files into `backend/`.
- [ ] Add root scripts that run frontend and backend independently.
- [ ] Update docs so local startup matches the new layout.

### Task 2: Add Backend Bug APIs

**Files:**
- Modify: `backend/src/server.ts`
- Modify: `backend/src/services/bugStore.ts`
- Test: `backend/src/services/bugStore.ts`

- [ ] Add a store that initializes from the mock bug dataset.
- [ ] Add `GET /api/health`.
- [ ] Add `GET /api/bugs` returning current bugs sorted by latest update.
- [ ] Keep `POST /api/bugs/ingest`, but persist into the in-memory store and return the created bug.

### Task 3: Replace Frontend Static Data With API Data

**Files:**
- Create: `frontend/src/services/bugApi.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/layout/AppShell.tsx`
- Modify: `frontend/src/components/dashboard/DashboardPage.tsx`
- Modify: `frontend/src/components/bug-list/BugListPage.tsx`

- [ ] Fetch initial bug data from the backend on app load.
- [ ] Keep local UI updates in sync after claim/status changes.
- [ ] Derive dashboard counts from real bug data.
- [ ] Sort the dashboard recent list by freshness/priority instead of array order.

### Task 4: Make Detail Evidence Dynamic

**Files:**
- Modify: `frontend/src/components/bug-detail/BugDetailPage.tsx`
- Modify: `frontend/src/components/bug-detail/TerminalLogViewer.tsx`
- Modify: `frontend/src/components/bug-detail/BugTimeline.tsx`
- Modify: `frontend/src/components/bug-detail/VerificationModal.tsx`
- Modify: `frontend/src/components/bug-detail/DedupeBadge.tsx`

- [ ] Generate log lines from the current bug and its platform context.
- [ ] Generate lifecycle timeline entries from the current bug state and metadata.
- [ ] Reset verification modal state on reopen.
- [ ] Remove random dedupe counts so the UI stays stable.

### Task 5: Verify And Document

**Files:**
- Modify: `README.md`

- [ ] Run frontend lint/build.
- [ ] Run backend type-check.
- [ ] Sanity-check the new startup commands.
- [ ] Summarize any remaining demo-only limitations in the README.
