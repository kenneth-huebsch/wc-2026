import Papa from 'papaparse';
import type { MatchResult, TournamentRound } from '../domain/types';
import type { ParsedPoolCsv, PoolCsvTabs, PoolCsvUrls } from './sheetSchema';

type CsvRecord = Record<string, string>;

const knockoutRounds: MatchResult['round'][] = ['round-of-32', 'round-of-16', 'quarterfinal', 'semifinal', 'final'];

export async function loadPoolDataFromUrls(urls: PoolCsvUrls): Promise<ParsedPoolCsv> {
  const [participants, teams, investments, groupResults, matches] = await Promise.all([
    fetchCsv(urls.participants),
    fetchCsv(urls.teams),
    fetchCsv(urls.investments),
    fetchCsv(urls.groupResults),
    fetchCsv(urls.matches),
  ]);

  return parsePoolCsvTabs({
    participants,
    teams,
    investments,
    groupResults,
    matches,
  });
}

export function parsePoolCsvTabs(tabs: PoolCsvTabs): ParsedPoolCsv {
  const warnings: string[] = [];
  const participants = parseCsv(tabs.participants).map((row) => ({
    id: getRequired(row, 'participant_id', warnings),
    name: getRequired(row, 'name', warnings),
  }));
  const teams = parseCsv(tabs.teams).map((row) => ({
    id: getRequired(row, 'team_id', warnings),
    name: getRequired(row, 'name', warnings),
    group: getRequired(row, 'group', warnings),
  }));
  const investments = parseCsv(tabs.investments).map((row) => ({
    participantId: getRequired(row, 'participant_id', warnings),
    teamId: getRequired(row, 'team_id', warnings),
    amount: parseWholeDollarAmount(getRequired(row, 'amount', warnings), warnings),
  }));
  const groupResults = parseCsv(tabs.groupResults).map((row) => ({
    group: getRequired(row, 'group', warnings),
    advancingTeamIds: splitIds(row.advancing_team_ids),
  }));
  const matches = parseCsv(tabs.matches).map((row) => {
    const played = parseBoolean(row.played);

    return {
      round: parseRound(getRequired(row, 'round', warnings), warnings),
      teamAId: getMatchTeamValue(row, 'team_a_id', played, warnings),
      teamBId: getMatchTeamValue(row, 'team_b_id', played, warnings),
      winnerTeamId: getMatchTeamValue(row, 'winner_team_id', played, warnings),
      played,
    };
  });

  return {
    input: {
      participants,
      teams,
      investments,
      groupResults,
      matches,
    },
    warnings,
  };
}

async function fetchCsv(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV from ${url}: ${response.status}`);
  }

  return response.text();
}

function parseCsv(csv: string): CsvRecord[] {
  const parsed = Papa.parse<CsvRecord>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  return parsed.data;
}

function getRequired(row: CsvRecord, key: string, warnings: string[]): string {
  const value = row[key]?.trim() ?? '';

  if (!value) {
    warnings.push(`Missing required value for ${key}`);
  }

  return value;
}

function getMatchTeamValue(row: CsvRecord, key: string, played: boolean, warnings: string[]): string {
  return played ? getRequired(row, key, warnings) : (row[key]?.trim() ?? '');
}

function parseWholeDollarAmount(value: string, warnings: string[]): number {
  const amount = Number(value);

  if (!Number.isInteger(amount) || amount < 0) {
    warnings.push(`Invalid whole-dollar amount: ${value}`);
    return 0;
  }

  return amount;
}

function splitIds(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

function parseRound(value: string, warnings: string[]): Exclude<TournamentRound, 'group'> {
  if (knockoutRounds.includes(value as MatchResult['round'])) {
    return value as MatchResult['round'];
  }

  warnings.push(`Invalid knockout round: ${value}`);
  return 'round-of-32';
}

function parseBoolean(value: string | undefined): boolean {
  return value?.toLowerCase() === 'true';
}
