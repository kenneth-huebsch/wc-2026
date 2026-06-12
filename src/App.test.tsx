import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the leaderboard as the home page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'World Cup 2026 Pool' })).toBeTruthy();
    expect(screen.getByText("Up to date leaderboard for Zach Fenn's 2026 world cup pari-mutuel pool.")).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Leaderboard' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Data freshness' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Participant Detail' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Team Detail' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Rules Summary' })).toBeNull();
  });

  it('navigates between the four dashboard pages', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Participant Details' }));
    expect(screen.getByRole('heading', { name: 'Participant Detail' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Leaderboard' })).toBeNull();
    expect(screen.queryByRole('region', { name: 'Data freshness' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Team Details' }));
    expect(screen.getByRole('heading', { name: 'Team Detail' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Participant Detail' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Rules Summary' }));
    expect(screen.getByRole('heading', { name: 'Rules Summary' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Team Detail' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(screen.getByRole('heading', { name: 'Leaderboard' })).toBeTruthy();
  });
});
