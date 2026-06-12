import type { PoolInput } from '../domain/types';

export const samplePoolInput: PoolInput = {
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
