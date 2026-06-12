import { describe, expect, it } from 'vitest';
import { parsePoolCsvTabs } from './loadPoolData';

describe('parsePoolCsvTabs', () => {
  it('converts Google Sheet CSV tabs into pool input', () => {
    const result = parsePoolCsvTabs({
      participants:
        'participant_id,name\nalex,Alex\ncasey,Casey\n',
      teams:
        'team_id,name,group\nfrance,France,I\nsenegal,Senegal,I\n',
      investments:
        'participant_id,team_id,amount\nalex,france,25\ncasey,france,100\nalex,senegal,1\n',
      groupResults:
        'group,advancing_team_ids\nI,"france,senegal"\n',
      matches:
        'round,team_a_id,team_b_id,winner_team_id,played\nround-of-32,france,senegal,france,true\n',
    });

    expect(result.warnings).toEqual([]);
    expect(result.input).toEqual({
      participants: [
        { id: 'alex', name: 'Alex' },
        { id: 'casey', name: 'Casey' },
      ],
      teams: [
        { id: 'france', name: 'France', group: 'I' },
        { id: 'senegal', name: 'Senegal', group: 'I' },
      ],
      investments: [
        { participantId: 'alex', teamId: 'france', amount: 25 },
        { participantId: 'casey', teamId: 'france', amount: 100 },
        { participantId: 'alex', teamId: 'senegal', amount: 1 },
      ],
      groupResults: [{ group: 'I', advancingTeamIds: ['france', 'senegal'] }],
      matches: [
        {
          round: 'round-of-32',
          teamAId: 'france',
          teamBId: 'senegal',
          winnerTeamId: 'france',
          played: true,
        },
      ],
    });
  });

  it('allows future unplayed matches to omit teams and winner', () => {
    const result = parsePoolCsvTabs({
      participants: 'participant_id,name\nalex,Alex\n',
      teams: 'team_id,name,group\nfrance,France,I\nsenegal,Senegal,I\n',
      investments: 'participant_id,team_id,amount\nalex,france,25\n',
      groupResults: 'group,advancing_team_ids\n',
      matches: 'round,team_a_id,team_b_id,winner_team_id,played\nfinal,,,,FALSE\n',
    });

    expect(result.warnings).toEqual([]);
    expect(result.input.matches).toEqual([
      {
        round: 'final',
        teamAId: '',
        teamBId: '',
        winnerTeamId: '',
        played: false,
      },
    ]);
  });
});
