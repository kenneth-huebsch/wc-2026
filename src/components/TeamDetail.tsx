import type { PoolStandings } from '../domain/types';
import { TeamNameWithFlag } from './TeamNameWithFlag';

type TeamDetailProps = {
  standings: PoolStandings;
};

export function TeamDetail({ standings }: TeamDetailProps) {
  const teams = Object.values(standings.teamSummaries).sort((a, b) => getTeamTotalPoints(b) - getTeamTotalPoints(a));

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Teams</h2>
      </div>
      <div className="detail-grid">
        {teams.map((team) => (
          <article className="detail-card" key={team.teamId}>
            <div className="detail-card-heading">
              <h3>
                <TeamNameWithFlag teamId={team.teamId} teamName={team.teamName} />
              </h3>
              <p className="metric">{formatPoints(getTeamTotalPoints(team))} pts</p>
            </div>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Amount</th>
                  <th>% Owned</th>
                </tr>
              </thead>
              <tbody>
                {[...team.owners].sort((a, b) => b.ownership - a.ownership).map((owner) => (
                  <tr key={owner.participantId}>
                    <td className="detail-name">{owner.participantName}</td>
                    <td>${owner.amount}</td>
                    <td>{formatPercent(owner.ownership)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {team.scoringEvents.length > 0 ? (
              <ul>
                {team.scoringEvents.map((event) => (
                  <li key={`${event.round}-${event.teamId}`}>
                    <span>{event.description}</span>
                    <span>{formatPoints(event.points)} pts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No scoring events yet.</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function getTeamTotalPoints(team: PoolStandings['teamSummaries'][string]): number {
  return team.scoringEvents.reduce((total, event) => total + event.points, 0);
}

function formatPoints(points: number): string {
  return Number.isInteger(points) ? points.toString() : points.toFixed(1);
}
