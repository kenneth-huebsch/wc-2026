import type { PoolInput } from '../domain/types';

export type PoolCsvTabs = {
  participants: string;
  teams: string;
  investments: string;
  groupResults: string;
  matches: string;
};

export type PoolCsvUrls = PoolCsvTabs;

export type ParsedPoolCsv = {
  input: PoolInput;
  warnings: string[];
};

export const sheetTabNames = {
  participants: 'Participants',
  teams: 'Teams',
  investments: 'Investments',
  groupResults: 'Group Results',
  matches: 'Matches',
} as const;
