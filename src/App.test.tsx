import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the leaderboard as the home page', () => {
    render(<App />);

    expect(screen.getByRole('img', { name: 'FIFA World Cup 2026 emblem' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'World Cup 2026 Pool' })).toBeTruthy();
    expect(screen.getByText('Up to date leaderboard and information for Zach Fenn\u2019s pari-mutuel pool.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Facebook Group' }).getAttribute('href')).toBe(
      'https://www.facebook.com/share/g/14rKTNnYfVr/',
    );
    expect(screen.getByRole('heading', { name: 'Leaderboard' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Data freshness' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Participants' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Teams' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Rules' })).toBeNull();
  });

  it('navigates between the four dashboard pages', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Participants' }));
    expect(screen.getByRole('heading', { name: 'Participants' })).toBeTruthy();
    const caseyHeading = screen.getByRole('heading', { name: 'Casey' });
    const caseyHeadingRow = caseyHeading.parentElement as HTMLElement;
    const caseyCard = caseyHeading.closest('article');

    expect(caseyHeadingRow.className).toBe('detail-card-heading');
    expect(within(caseyHeadingRow).getByText('264 pts')).toBeTruthy();
    expect(caseyCard).toBeTruthy();

    expect(within(caseyCard as HTMLElement).queryByText('Team Profile')).toBeNull();
    const caseyTable = within(caseyCard as HTMLElement).getByRole('table');
    expect(within(caseyTable).getByRole('columnheader', { name: 'Country' })).toBeTruthy();
    expect(within(caseyTable).getByRole('columnheader', { name: '% Owned' })).toBeTruthy();
    expect(within(caseyTable).getByRole('columnheader', { name: 'Points Earned' })).toBeTruthy();
    expect(within(caseyTable).getByRole('cell', { name: 'France' })).toBeTruthy();
    expect(within(caseyTable).getByRole('cell', { name: '80.0%' })).toBeTruthy();
    expect(within(caseyTable).getByRole('cell', { name: '264 pts' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Leaderboard' })).toBeNull();
    expect(screen.queryByRole('region', { name: 'Data freshness' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Teams' }));
    expect(screen.getByRole('heading', { name: 'Teams' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Participants' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Rules' }));
    expect(screen.getByRole('heading', { name: 'Rules' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Teams' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(screen.getByRole('heading', { name: 'Leaderboard' })).toBeTruthy();
  });
});
