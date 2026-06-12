# World Cup Pool Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public World Cup pari-mutuel pool dashboard that reads Google Sheets data, calculates standings from the pool rules, and deploys easily on Netlify.

**Architecture:** Use a Vite React TypeScript static app. Keep scoring and data normalization in pure TypeScript modules with Vitest coverage, then render those derived standings in focused React views. Use published Google Sheet CSV tabs as the runtime data source, with sample CSV fixtures for local development and tests.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, Papa Parse, Netlify static hosting.

---

## File Structure

- `package.json`: npm scripts and dependencies.
- `vite.config.ts`: Vite and Vitest configuration.
- `netlify.toml`: Netlify build and publish settings.
- `.gitignore`: generated files to ignore.
- `index.html`: Vite app entry document.
- `src/main.tsx`: React bootstrap.
- `src/App.tsx`: page composition and app state.
- `src/styles.css`: layout and table styles.
- `src/domain/types.ts`: shared domain types.
- `src/domain/scoring.ts`: pure pari-mutuel scoring engine.
- `src/domain/scoring.test.ts`: scoring rule tests.
- `src/data/sheetSchema.ts`: spreadsheet row types and tab names.
- `src/data/loadPoolData.ts`: CSV loading and parsing.
- `src/data/sampleData.ts`: local fallback sample data.
- `src/components/Leaderboard.tsx`: leaderboard table.
- `src/components/ParticipantDetail.tsx`: participant detail table.
- `src/components/TeamDetail.tsx`: team ownership and scoring detail.
- `src/components/RulesSummary.tsx`: concise rules explanation.
- `src/components/DataFreshness.tsx`: last-updated and validation display.
- `scripts/README-excel-import.md`: manual workflow for converting the existing Excel workbook into Google Sheet tabs.

## Task 1: Scaffold The Static App

**Files:**
- Create: all root Vite project files and `src` directory.

- [ ] **Step 1: Generate the Vite React TypeScript app**

Run from `/Users/Kenneth.Huebsch/Repositories/wc`:

```bash
npm create vite@latest . -- --template react-ts
```

Expected: Vite creates `package.json`, `index.html`, `src`, and TypeScript config files.

- [ ] **Step 2: Install runtime and test dependencies**

```bash
npm install
npm install papaparse
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Configure Vitest**

Update `vite.config.ts` so test files run under `jsdom`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: Add Netlify config**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## Task 2: Build The Scoring Engine With TDD

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/scoring.test.ts`
- Create: `src/domain/scoring.ts`

- [ ] **Step 1: Write a failing ownership test**

Create `src/domain/scoring.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { calculatePoolStandings } from './scoring';
import type { PoolInput } from './types';

describe('calculatePoolStandings', () => {
  it('calculates ownership percentages from team investment totals', () => {
    const input: PoolInput = {
      participants: [
        { id: 'alex', name: 'Alex' },
        { id: 'blair', name: 'Blair' },
      ],
      teams: [
        { id: 'france', name: 'France', group: 'I' },
      ],
      investments: [
        { participantId: 'alex', teamId: 'france', amount: 25 },
        { participantId: 'blair', teamId: 'france', amount: 100 },
      ],
      groupResults: [],
      matches: [],
    };

    const standings = calculatePoolStandings(input);

    expect(standings.teamSummaries.france.owners).toEqual([
      { participantId: 'alex', participantName: 'Alex', amount: 25, ownership: 0.2, points: 0 },
      { participantId: 'blair', participantName: 'Blair', amount: 100, ownership: 0.8, points: 0 },
    ]);
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

```bash
npm test -- src/domain/scoring.test.ts
```

Expected: fails because `src/domain/scoring.ts` and `src/domain/types.ts` do not exist.

- [ ] **Step 3: Add minimal types and ownership implementation**

Create `src/domain/types.ts` with `Participant`, `Team`, `Investment`, `GroupResult`, `MatchResult`, `PoolInput`, and summary types. Create `src/domain/scoring.ts` with `calculatePoolStandings(input: PoolInput): PoolStandings` that computes investment totals, owner percentages, empty scoring events, and zeroed participant totals.

- [ ] **Step 4: Run the test and confirm GREEN**

```bash
npm test -- src/domain/scoring.test.ts
```

Expected: passes.

- [ ] **Step 5: Add failing group-stage scoring test**

Extend `src/domain/scoring.test.ts` with a group where France and Senegal advance, Norway and Iraq are eliminated, and verify France carries `145`, Senegal carries `21`, and owners receive ownership-adjusted points.

- [ ] **Step 6: Implement group-stage scoring**

Update `calculatePoolStandings` so advancing teams receive their own original value plus an equal share of eliminated team values within the group, and participant points are credited by ownership percentage.

- [ ] **Step 7: Add failing knockout carry-forward test**

Add a match where France enters with `145`, Scotland enters with `40`, France wins, and verify France receives/carries `185` and France owners receive their ownership share of `185`.

- [ ] **Step 8: Implement knockout scoring**

Process played matches in round order, calculate each match value as the sum of both teams' carried values, credit the winner's owners, and set the winner's carried value to the match value.

## Task 3: Load Google Sheet Data

**Files:**
- Create: `src/data/sheetSchema.ts`
- Create: `src/data/loadPoolData.ts`
- Create: `src/data/sampleData.ts`

- [ ] **Step 1: Write parser tests for published CSV rows**

Add tests that parse participant, team, investment, group result, and match CSV rows into `PoolInput`.

- [ ] **Step 2: Implement CSV parsing**

Use Papa Parse with top-level imports. Convert whole-dollar amounts to numbers, trim ids/names, and collect validation warnings instead of throwing for non-critical missing optional data.

- [ ] **Step 3: Add local sample data**

Create sample participants, teams, investments, one group result, and one match so the UI works before a real Google Sheet exists.

## Task 4: Build The First UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `src/styles.css`
- Create: component files under `src/components`.

- [ ] **Step 1: Write component tests for leaderboard rendering**

Use Testing Library to render `Leaderboard` with calculated standings and assert rank, participant name, total points, and payout marker.

- [ ] **Step 2: Implement `Leaderboard`**

Render standings sorted by points descending, with last-place payout highlighted.

- [ ] **Step 3: Add participant, team, rules, and freshness components**

Render focused tables from `PoolStandings`, with no auth or editing controls.

- [ ] **Step 4: Compose the app**

Load Google Sheet data when configured; otherwise load sample data. Calculate standings and render the dashboard views.

## Task 5: Document Google Sheet And Excel Import Workflow

**Files:**
- Create: `scripts/README-excel-import.md`
- Create: `docs/google-sheet-schema.md`

- [ ] **Step 1: Document expected Google Sheet tabs**

List every tab, column name, required field, and example row.

- [ ] **Step 2: Document Excel import steps**

Explain how the workbook will be inspected, normalized into the schema, checked for duplicate participants/teams, and copied into Google Sheets.

## Task 6: Verify And Prepare For Netlify

**Files:**
- Modify as needed based on verification failures.

- [ ] **Step 1: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 3: Confirm Netlify setup**

Verify `netlify.toml` uses `npm run build` and publishes `dist`.

## Self-Review

- Spec coverage: covers Netlify deployment, Google Sheets source data, Excel import workflow, scoring engine, and core user views.
- Placeholder scan: no `TBD` or `TODO` markers.
- Type consistency: planned modules use `PoolInput`, `PoolStandings`, participants, teams, investments, group results, and match results consistently.
