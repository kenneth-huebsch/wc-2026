import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TeamNameWithFlag } from './TeamNameWithFlag';

describe('TeamNameWithFlag', () => {
  it('renders an aria-hidden flag next to a known team name', () => {
    const { container } = render(<TeamNameWithFlag teamId="france" teamName="France" />);

    expect(screen.getByText('France')).toBeTruthy();

    const flag = container.querySelector('.fi.fi-fr');
    expect(flag).toBeTruthy();
    expect(flag?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders only the team name when a team has no flag mapping', () => {
    const { container } = render(<TeamNameWithFlag teamId="unknown-team" teamName="Unknown Team" />);

    expect(screen.getByText('Unknown Team')).toBeTruthy();
    expect(container.querySelector('.fi')).toBeNull();
  });
});
