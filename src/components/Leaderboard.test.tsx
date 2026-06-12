import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Leaderboard } from './Leaderboard';
import type { PoolStandings } from '../domain/types';

describe('Leaderboard', () => {
  it('renders participants by points', () => {
    const standings: PoolStandings = {
      participants: [
        { participantId: 'alex', participantName: 'Alex', totalPoints: 66, teams: [] },
        { participantId: 'casey', participantName: 'Casey', totalPoints: 264, teams: [] },
        { participantId: 'devon', participantName: 'Devon', totalPoints: 21, teams: [] },
        { participantId: 'elliot', participantName: 'Elliot', totalPoints: 0, teams: [] },
      ],
      teamSummaries: {},
    };

    render(<Leaderboard standings={standings} />);

    const rows = screen.getAllByRole('row').map((row) => row.textContent ?? '');
    expect(rows[1]).toContain('1');
    expect(rows[1]).toContain('Casey');
    expect(rows[1]).toContain('264');
    expect(rows[4]).toContain('Elliot');
    expect(screen.queryByText('Payout Position')).toBeNull();
  });
});
