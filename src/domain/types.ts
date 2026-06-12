export type Participant = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  group: string;
};

export type Investment = {
  participantId: string;
  teamId: string;
  amount: number;
};

export type GroupResult = {
  group: string;
  advancingTeamIds: string[];
};

export type TournamentRound = 'group' | 'round-of-32' | 'round-of-16' | 'quarterfinal' | 'semifinal' | 'final';

export type MatchResult = {
  round: Exclude<TournamentRound, 'group'>;
  teamAId: string;
  teamBId: string;
  winnerTeamId: string;
  played: boolean;
};

export type PoolInput = {
  participants: Participant[];
  teams: Team[];
  investments: Investment[];
  groupResults: GroupResult[];
  matches: MatchResult[];
};

export type TeamOwnerSummary = {
  participantId: string;
  participantName: string;
  amount: number;
  ownership: number;
  points: number;
};

export type ScoringEvent = {
  round: TournamentRound;
  teamId: string;
  points: number;
  description: string;
};

export type TeamSummary = {
  teamId: string;
  teamName: string;
  group: string;
  totalInvestment: number;
  carriedValue: number;
  owners: TeamOwnerSummary[];
  scoringEvents: ScoringEvent[];
};

export type ParticipantSummary = {
  participantId: string;
  participantName: string;
  totalPoints: number;
  teams: Array<{
    teamId: string;
    teamName: string;
    amount: number;
    ownership: number;
    points: number;
  }>;
};

export type PoolStandings = {
  participants: ParticipantSummary[];
  teamSummaries: Record<string, TeamSummary>;
};
