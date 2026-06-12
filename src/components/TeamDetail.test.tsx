import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PoolStandings } from '../domain/types';
import { TeamDetail } from './TeamDetail';

describe('TeamDetail', () => {
  it('renders team points in the heading and owners in a table', () => {
    const standings: PoolStandings = {
      participants: [],
      teamSummaries: {
        canada: {
          teamId: 'canada',
          teamName: 'Canada',
          group: 'C',
          totalInvestment: 20,
          carriedValue: 20,
          owners: [{ participantId: 'devon', participantName: 'Devon', amount: 20, ownership: 1, points: 20 }],
          scoringEvents: [],
        },
        france: {
          teamId: 'france',
          teamName: 'France',
          group: 'I',
          totalInvestment: 125,
          carriedValue: 185,
          owners: [
            { participantId: 'alex', participantName: 'Alex', amount: 25, ownership: 0.2, points: 37 },
            { participantId: 'casey', participantName: 'Casey', amount: 100, ownership: 0.8, points: 148 },
          ],
          scoringEvents: [{ round: 'group', teamId: 'france', points: 145, description: 'Advanced from Group I' }],
        },
      },
    };

    render(<TeamDetail standings={standings} />);

    const teamHeadings = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(teamHeadings).toEqual(['France', 'Canada']);

    const franceHeading = screen.getByRole('heading', { name: 'France' });
    const franceHeadingRow = franceHeading.parentElement as HTMLElement;
    const franceCard = franceHeading.closest('article');

    expect(franceHeadingRow.className).toBe('detail-card-heading');
    expect(franceHeadingRow.querySelector('.fi.fi-fr')).toBeTruthy();
    expect(within(franceHeadingRow).getByText('185 pts')).toBeTruthy();
    expect(within(franceHeadingRow).queryByText('185 carried pts')).toBeNull();
    expect(franceCard).toBeTruthy();

    const ownersTable = within(franceCard as HTMLElement).getByRole('table');
    expect(within(ownersTable).getByRole('columnheader', { name: 'Participant' })).toBeTruthy();
    expect(within(ownersTable).getByRole('columnheader', { name: 'Amount' })).toBeTruthy();
    expect(within(ownersTable).getByRole('columnheader', { name: '% Owned' })).toBeTruthy();
    const rows = within(ownersTable).getAllByRole('row').map((row) => row.textContent ?? '');
    expect(rows[1]).toContain('Casey');
    expect(rows[2]).toContain('Alex');
    expect(within(ownersTable).getByRole('cell', { name: 'Alex' })).toBeTruthy();
    expect(within(ownersTable).getByRole('cell', { name: '$25' })).toBeTruthy();
    expect(within(ownersTable).getByRole('cell', { name: '20.0%' })).toBeTruthy();
    expect(within(franceCard as HTMLElement).getByText('Advanced from Group I')).toBeTruthy();
    expect(franceCard?.querySelector('.detail-divider')).toBeNull();
  });
});
