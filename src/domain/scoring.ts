import type { PoolInput, PoolStandings, TeamOwnerSummary, TeamSummary } from './types';

export function calculatePoolStandings(input: PoolInput): PoolStandings {
  const participantsById = new Map(input.participants.map((participant) => [participant.id, participant]));
  const teamInvestmentTotals = new Map<string, number>();

  for (const investment of input.investments) {
    teamInvestmentTotals.set(
      investment.teamId,
      (teamInvestmentTotals.get(investment.teamId) ?? 0) + investment.amount,
    );
  }

  const teamSummaries: Record<string, TeamSummary> = {};

  for (const team of input.teams) {
    const totalInvestment = teamInvestmentTotals.get(team.id) ?? 0;
    const owners: TeamOwnerSummary[] = input.investments
      .filter((investment) => investment.teamId === team.id)
      .map((investment) => {
        const participant = participantsById.get(investment.participantId);

        return {
          participantId: investment.participantId,
          participantName: participant?.name ?? investment.participantId,
          amount: investment.amount,
          ownership: totalInvestment === 0 ? 0 : investment.amount / totalInvestment,
          points: 0,
        };
      });

    teamSummaries[team.id] = {
      teamId: team.id,
      teamName: team.name,
      group: team.group,
      totalInvestment,
      carriedValue: totalInvestment,
      owners,
      scoringEvents: [],
    };
  }

  for (const groupResult of input.groupResults) {
    const groupTeams = Object.values(teamSummaries).filter((teamSummary) => teamSummary.group === groupResult.group);
    const advancingTeamIds = new Set(groupResult.advancingTeamIds);
    const eliminatedValue = groupTeams
      .filter((teamSummary) => !advancingTeamIds.has(teamSummary.teamId))
      .reduce((total, teamSummary) => total + teamSummary.carriedValue, 0);
    const eliminatedShare =
      groupResult.advancingTeamIds.length === 0 ? 0 : eliminatedValue / groupResult.advancingTeamIds.length;

    for (const teamId of groupResult.advancingTeamIds) {
      const teamSummary = teamSummaries[teamId];

      if (!teamSummary) {
        continue;
      }

      const points = teamSummary.carriedValue + eliminatedShare;
      creditTeamOwners(teamSummary, points);
      teamSummary.carriedValue = points;
      teamSummary.scoringEvents.push({
        round: 'group',
        teamId,
        points,
        description: `Advanced from Group ${groupResult.group}`,
      });
    }
  }

  const playedMatches = [...input.matches]
    .filter((match) => match.played)
    .sort((a, b) => roundOrder.indexOf(a.round) - roundOrder.indexOf(b.round));

  for (const match of playedMatches) {
    const teamA = teamSummaries[match.teamAId];
    const teamB = teamSummaries[match.teamBId];
    const winner = teamSummaries[match.winnerTeamId];

    if (!teamA || !teamB || !winner) {
      continue;
    }

    const points = teamA.carriedValue + teamB.carriedValue;
    creditTeamOwners(winner, points);
    winner.carriedValue = points;
    winner.scoringEvents.push({
      round: match.round,
      teamId: winner.teamId,
      points,
      description: `Won ${match.round}`,
    });
  }

  const participantSummaries = input.participants.map((participant) => ({
    participantId: participant.id,
    participantName: participant.name,
    totalPoints: Object.values(teamSummaries).reduce(
      (total, teamSummary) =>
        total + (teamSummary.owners.find((owner) => owner.participantId === participant.id)?.points ?? 0),
      0,
    ),
    teams: Object.values(teamSummaries)
      .flatMap((teamSummary) =>
        teamSummary.owners
          .filter((owner) => owner.participantId === participant.id)
          .map((owner) => ({
            teamId: teamSummary.teamId,
            teamName: teamSummary.teamName,
            amount: owner.amount,
            ownership: owner.ownership,
            points: owner.points,
          })),
      ),
  }));

  return {
    participants: participantSummaries,
    teamSummaries,
  };
}

const roundOrder = ['round-of-32', 'round-of-16', 'quarterfinal', 'semifinal', 'final'];

function creditTeamOwners(teamSummary: TeamSummary, points: number): void {
  for (const owner of teamSummary.owners) {
    owner.points += points * owner.ownership;
  }
}
