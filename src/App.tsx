import { useEffect, useMemo, useState } from 'react';
import { DataFreshness } from './components/DataFreshness';
import { Leaderboard } from './components/Leaderboard';
import { ParticipantDetail } from './components/ParticipantDetail';
import { RulesSummary } from './components/RulesSummary';
import { TeamDetail } from './components/TeamDetail';
import { loadPoolDataFromUrls } from './data/loadPoolData';
import { samplePoolInput } from './data/sampleData';
import type { PoolCsvUrls } from './data/sheetSchema';
import { calculatePoolStandings } from './domain/scoring';
import type { PoolInput } from './domain/types';

type PageId = 'leaderboard' | 'participants' | 'teams' | 'rules';

type Page = {
  id: PageId;
  label: string;
};

type DataState = {
  input: PoolInput;
  source: string;
  loadedAt: Date;
  warnings: string[];
};

const configuredUrls = getConfiguredSheetUrls();
const pages: Page[] = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'participants', label: 'Participants' },
  { id: 'teams', label: 'Teams' },
  { id: 'rules', label: 'Rules' },
];
const worldCupEmblemSrc = '/2026_FIFA_World_Cup_emblem.png';
const facebookGroupUrl = 'https://www.facebook.com/share/g/14rKTNnYfVr/';

export function App() {
  const [activePage, setActivePage] = useState<PageId>('leaderboard');
  const [dataState, setDataState] = useState<DataState>({
    input: samplePoolInput,
    source: configuredUrls ? 'Google Sheet' : 'Sample data',
    loadedAt: new Date(),
    warnings: configuredUrls ? ['Loading Google Sheet data...'] : [],
  });

  useEffect(() => {
    if (!configuredUrls) {
      return;
    }

    let isActive = true;

    loadPoolDataFromUrls(configuredUrls)
      .then((result) => {
        if (!isActive) {
          return;
        }

        setDataState({
          input: result.input,
          source: 'Google Sheet',
          loadedAt: new Date(),
          warnings: result.warnings,
        });
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unknown Google Sheet loading error';
        setDataState((current) => ({
          ...current,
          source: 'Sample data',
          warnings: [`Using sample data because Google Sheet loading failed: ${message}`],
        }));
      });

    return () => {
      isActive = false;
    };
  }, []);

  const standings = useMemo(() => calculatePoolStandings(dataState.input), [dataState.input]);

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <h1>World Cup 2026 Pool</h1>
          <p>Up to date leaderboard and information for Zach Fenn&rsquo;s pari-mutuel pool.</p>
          <a
            className="facebook-group-link"
            href={facebookGroupUrl}
            rel="noreferrer"
            target="_blank"
          >
            <span className="facebook-logo" aria-hidden="true">
              <span className="facebook-logo-mark">f</span>
            </span>
            <span>Facebook Group</span>
          </a>
        </div>
        <img className="hero-emblem" src={worldCupEmblemSrc} alt="FIFA World Cup 2026 emblem" />
      </header>
      <nav className="page-nav" aria-label="Dashboard pages">
        {pages.map((page) => (
          <button
            aria-current={activePage === page.id ? 'page' : undefined}
            className="page-nav-button"
            key={page.id}
            onClick={() => setActivePage(page.id)}
            type="button"
          >
            {page.label}
          </button>
        ))}
      </nav>
      {renderPage(activePage, standings)}
      {activePage === 'leaderboard' ? (
        <DataFreshness source={dataState.source} loadedAt={dataState.loadedAt} warnings={dataState.warnings} />
      ) : null}
    </main>
  );
}

function renderPage(activePage: PageId, standings: ReturnType<typeof calculatePoolStandings>) {
  switch (activePage) {
    case 'leaderboard':
      return <Leaderboard standings={standings} />;
    case 'participants':
      return <ParticipantDetail standings={standings} />;
    case 'teams':
      return <TeamDetail standings={standings} />;
    case 'rules':
      return <RulesSummary />;
    default: {
      const exhaustiveCheck: never = activePage;
      return exhaustiveCheck;
    }
  }
}

function getConfiguredSheetUrls(): PoolCsvUrls | undefined {
  const urls: PoolCsvUrls = {
    participants: import.meta.env.VITE_PARTICIPANTS_CSV_URL ?? '',
    teams: import.meta.env.VITE_TEAMS_CSV_URL ?? '',
    investments: import.meta.env.VITE_INVESTMENTS_CSV_URL ?? '',
    groupResults: import.meta.env.VITE_GROUP_RESULTS_CSV_URL ?? '',
    matches: import.meta.env.VITE_MATCHES_CSV_URL ?? '',
  };

  return Object.values(urls).every(Boolean) ? urls : undefined;
}
