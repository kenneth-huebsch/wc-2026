import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PoolStandings } from '../domain/types';
import { ParticipantDetail } from './ParticipantDetail';

describe('ParticipantDetail', () => {
  it('sorts participant team rows by points earned', () => {
    const standings: PoolStandings = {
      participants: [
        {
          participantId: 'casey',
          participantName: 'Casey',
          totalPoints: 35,
          teams: [
            { teamId: 'low', teamName: 'Low Points', amount: 10, ownership: 0.2, points: 5 },
            { teamId: 'high', teamName: 'High Points', amount: 10, ownership: 0.5, points: 20 },
            { teamId: 'mid', teamName: 'Middle Points', amount: 10, ownership: 0.3, points: 10 },
          ],
        },
      ],
      teamSummaries: {},
    };

    render(<ParticipantDetail standings={standings} />);

    const rows = screen.getAllByRole('row').map((row) => row.textContent ?? '');
    expect(rows[1]).toContain('High Points');
    expect(rows[2]).toContain('Middle Points');
    expect(rows[3]).toContain('Low Points');
  });

  it('renders a flag next to mapped team names', () => {
    const standings: PoolStandings = {
      participants: [
        {
          participantId: 'casey',
          participantName: 'Casey',
          totalPoints: 20,
          teams: [{ teamId: 'france', teamName: 'France', amount: 10, ownership: 0.5, points: 20 }],
        },
      ],
      teamSummaries: {},
    };

    const { container } = render(<ParticipantDetail standings={standings} />);

    expect(screen.getByRole('cell', { name: 'France' })).toBeTruthy();
    expect(container.querySelector('.fi.fi-fr')).toBeTruthy();
  });
});
