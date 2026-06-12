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
      teams: [{ id: 'france', name: 'France', group: 'I' }],
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

  it('credits group advancers with their own value plus an equal share of eliminated team values', () => {
    const input: PoolInput = {
      participants: [
        { id: 'alex', name: 'Alex' },
        { id: 'casey', name: 'Casey' },
        { id: 'devon', name: 'Devon' },
      ],
      teams: [
        { id: 'france', name: 'France', group: 'I' },
        { id: 'senegal', name: 'Senegal', group: 'I' },
        { id: 'norway', name: 'Norway', group: 'I' },
        { id: 'iraq', name: 'Iraq', group: 'I' },
      ],
      investments: [
        { participantId: 'alex', teamId: 'france', amount: 25 },
        { participantId: 'casey', teamId: 'france', amount: 100 },
        { participantId: 'devon', teamId: 'senegal', amount: 1 },
        { participantId: 'alex', teamId: 'norway', amount: 20 },
        { participantId: 'casey', teamId: 'iraq', amount: 20 },
      ],
      groupResults: [{ group: 'I', advancingTeamIds: ['france', 'senegal'] }],
      matches: [],
    };

    const standings = calculatePoolStandings(input);

    expect(standings.teamSummaries.france.carriedValue).toBe(145);
    expect(standings.teamSummaries.senegal.carriedValue).toBe(21);
    expect(standings.teamSummaries.france.owners).toEqual([
      { participantId: 'alex', participantName: 'Alex', amount: 25, ownership: 0.2, points: 29 },
      { participantId: 'casey', participantName: 'Casey', amount: 100, ownership: 0.8, points: 116 },
    ]);
    expect(standings.teamSummaries.senegal.owners).toEqual([
      { participantId: 'devon', participantName: 'Devon', amount: 1, ownership: 1, points: 21 },
    ]);
  });

  it('credits knockout winners with the combined value and carries that value forward', () => {
    const input: PoolInput = {
      participants: [
        { id: 'alex', name: 'Alex' },
        { id: 'casey', name: 'Casey' },
        { id: 'devon', name: 'Devon' },
        { id: 'elliot', name: 'Elliot' },
      ],
      teams: [
        { id: 'france', name: 'France', group: 'I' },
        { id: 'senegal', name: 'Senegal', group: 'I' },
        { id: 'norway', name: 'Norway', group: 'I' },
        { id: 'iraq', name: 'Iraq', group: 'I' },
        { id: 'scotland', name: 'Scotland', group: 'C' },
        { id: 'japan', name: 'Japan', group: 'C' },
        { id: 'canada', name: 'Canada', group: 'C' },
        { id: 'morocco', name: 'Morocco', group: 'C' },
      ],
      investments: [
        { participantId: 'alex', teamId: 'france', amount: 25 },
        { participantId: 'casey', teamId: 'france', amount: 100 },
        { participantId: 'devon', teamId: 'senegal', amount: 1 },
        { participantId: 'alex', teamId: 'norway', amount: 20 },
        { participantId: 'casey', teamId: 'iraq', amount: 20 },
        { participantId: 'elliot', teamId: 'scotland', amount: 40 },
      ],
      groupResults: [
        { group: 'I', advancingTeamIds: ['france', 'senegal'] },
        { group: 'C', advancingTeamIds: ['scotland'] },
      ],
      matches: [
        {
          round: 'round-of-32',
          teamAId: 'france',
          teamBId: 'scotland',
          winnerTeamId: 'france',
          played: true,
        },
      ],
    };

    const standings = calculatePoolStandings(input);

    expect(standings.teamSummaries.france.carriedValue).toBe(185);
    expect(standings.teamSummaries.france.scoringEvents.at(-1)?.description).toBe('Won round-of-32');
    expect(standings.teamSummaries.france.owners).toEqual([
      { participantId: 'alex', participantName: 'Alex', amount: 25, ownership: 0.2, points: 66 },
      { participantId: 'casey', participantName: 'Casey', amount: 100, ownership: 0.8, points: 264 },
    ]);
    expect(standings.participants.find((participant) => participant.participantId === 'alex')?.totalPoints).toBe(66);
  });
});
