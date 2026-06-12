# World Cup Pool Dashboard

Public, no-auth dashboard for a World Cup pari-mutuel prediction pool. The app reads pool data from published Google Sheet CSV tabs, calculates standings from the rules in `WC26_PariMutuel_PoolRules.pdf`, and is designed to deploy as a static site on Netlify.

## What It Shows

- Leaderboard with payout position markers.
- Participant detail with owned teams, ownership percentages, and points.
- Team detail with investment totals, owners, carried value, and scoring events.
- Rules summary and data freshness status.

## Local Setup

Install Node dependencies:

```bash
npm install
```

If your npm cache has permission issues on this machine, use the project-local cache:

```bash
npm_config_cache=.npm-cache npm install
```

Run the local dev server:

```bash
npm run dev
```

Then open the local URL printed by Vite, usually `http://localhost:5173`.

## Useful Commands

```bash
npm test
```

Runs the Vitest test suite.

```bash
npm run build
```

Runs TypeScript checks and builds the production site into `dist`.

```bash
npm run preview
```

Serves the production build locally after `npm run build`.

## Data Source

The local app is configured through `.env.local` to read generated CSV files from `public/data`:

- `public/data/participants.csv`
- `public/data/teams.csv`
- `public/data/investments.csv`
- `public/data/group-results.csv`
- `public/data/matches.csv`

If the environment variables are missing, the app falls back to sample data in `src/data/sampleData.ts`.

For live data, create a Google Sheet with the schema documented in `docs/google-sheet-schema.md`, publish each tab as CSV, and set these environment variables:

- `VITE_PARTICIPANTS_CSV_URL`
- `VITE_TEAMS_CSV_URL`
- `VITE_INVESTMENTS_CSV_URL`
- `VITE_GROUP_RESULTS_CSV_URL`
- `VITE_MATCHES_CSV_URL`

All five URLs must be present. If any are missing, the app uses sample data.

## Google Sheet Tabs

Expected tabs:

- `Participants`
- `Teams`
- `Investments`
- `Group Results`
- `Matches`

The spreadsheet stores raw facts only. The app calculates ownership, team values, score events, and standings.

## Excel Import

When the existing Excel workbook is available, normalize it into the Google Sheet format described above. The import workflow is documented in `scripts/README-excel-import.md`.

To regenerate the local CSV files from the current workbook:

```bash
python3 scripts/extract_workbook.py "PariMutuel_757_Official_2026WC.xlsx" --out public/data
```

Current extraction result:

- 20 participants
- 48 teams
- 146 investment rows
- $1,000 total invested

Important checks during import:

- participant names map to stable ids
- team names map to stable ids
- investments are whole-dollar amounts
- participant and team ids match the schema
- ambiguous or duplicate rows are noted before publishing

## Netlify Deployment

`netlify.toml` is already configured:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

On Netlify:

1. Connect the repository.
2. Use the default build command from `netlify.toml`.
3. Add the five `VITE_*_CSV_URL` environment variables.
4. Deploy.

Netlify will serve the static files from `dist`.

## Project Docs

- Design: `docs/superpowers/specs/2026-06-12-world-cup-pool-design.md`
- Implementation plan: `docs/superpowers/plans/2026-06-12-world-cup-pool-implementation.md`
- Google Sheet schema: `docs/google-sheet-schema.md`
- Excel import workflow: `scripts/README-excel-import.md`
