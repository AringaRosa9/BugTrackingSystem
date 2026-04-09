# Insights And Archive Live Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `InsightsPage` and `ResolutionArchive` render from the live frontend `bugs` state instead of mock page-local data.

**Architecture:** Pass the existing live `bugs` array from `App` into both pages, then centralize analytics and archive grouping in a dedicated frontend utility. Keep components presentational and let tests drive the aggregation rules before wiring them into the UI.

**Tech Stack:** React 19, TypeScript, Recharts, Node test runner via `tsx`

---

### Task 1: Add Failing Analytics Tests

**Files:**
- Create: `frontend/src/utils/bugInsights.test.ts`
- Test: `frontend/src/utils/bugInsights.test.ts`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `npm run test --workspace frontend` and confirm it fails for missing analytics helpers**
- [ ] **Step 3: Implement the minimal analytics helpers**
- [ ] **Step 4: Re-run `npm run test --workspace frontend` and confirm the new tests pass**

### Task 2: Wire Live Analytics Into Insights

**Files:**
- Create: `frontend/src/utils/bugInsights.ts`
- Modify: `frontend/src/components/insights/InsightsPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] Pass `bugs` into `InsightsPage`
- [ ] Replace mock metric blocks with live metrics
- [ ] Replace chart datasets with live platform/status/trend datasets
- [ ] Replace the fake HRO module section with real platform risk summaries

### Task 3: Wire Live Archive Groups

**Files:**
- Modify: `frontend/src/components/archive/ResolutionArchive.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/utils/bugInsights.ts`

- [ ] Pass `bugs` into `ResolutionArchive`
- [ ] Build weekly groups from resolved bugs
- [ ] Replace mock releases with live weekly archive sections
- [ ] Generate fallback summary text when description is missing

### Task 4: Verify

**Files:**
- Modify: `README.md` if behavior notes need updates

- [ ] Run `npm run test --workspace frontend`
- [ ] Run `npm run lint --workspace frontend`
- [ ] Run `npm run build --workspace frontend`
