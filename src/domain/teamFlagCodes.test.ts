import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('teamFlagCodes', () => {
  it('has a flag-icons code for every team in the Teams CSV', async () => {
    const { teamFlagCodes } = await import('./teamFlagCodes');
    const teamIds = readFileSync(join(process.cwd(), 'public/data/teams.csv'), 'utf8')
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((row) => row.split(',')[0]);

    const missingTeamIds = teamIds.filter((teamId) => !teamFlagCodes[teamId]);

    expect(missingTeamIds).toEqual([]);
  });

  it('uses flag-icons regional codes for England and Scotland', async () => {
    const { teamFlagCodes } = await import('./teamFlagCodes');

    expect(teamFlagCodes.england).toBe('gb-eng');
    expect(teamFlagCodes.scotland).toBe('gb-sct');
  });
});
