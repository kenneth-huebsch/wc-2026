import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RulesSummary } from './RulesSummary';

describe('RulesSummary', () => {
  it('explains the participant investment total', () => {
    render(<RulesSummary />);

    expect(
      screen.getByText('Participants invest whole-dollar amounts in any teams they choose before the pool locks for a total of $50.'),
    ).toBeTruthy();
    expect(screen.getByText('Scoring starts when teams advance from the Group Stage.')).toBeTruthy();
    expect(
      screen.getByText('Each knockout match is winner-take-all: the winner earns and carries forward the sum of both teams\u2019 values.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Participant scores are the sum of ownership-adjusted points across all owned teams and across all stages.'),
    ).toBeTruthy();
  });
});
