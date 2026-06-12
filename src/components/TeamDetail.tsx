import type { PoolStandings } from '../domain/types';

type TeamDetailProps = {
  standings: PoolStandings;
};

export function TeamDetail({ standings }: TeamDetailProps) {
  const teams = Object.values(standings.teamSummaries).sort((a, b) => b.carriedValue - a.carriedValue);

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Team Detail</h2>
      </div>
      <div className="detail-grid">
        {teams.map((team) => (
          <article className="detail-card" key={team.teamId}>
            <h3>{team.teamName}</h3>
            <p className="metric">{formatPoints(team.carriedValue)} carried pts</p>
            <ul>
              {team.owners.map((owner) => (
                <li key={owner.participantId}>
                  <span className="detail-name">{owner.participantName}</span>
                  <span>
                    ${owner.amount}, {formatPercent(owner.ownership)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="detail-divider" />
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

function formatPoints(points: number): string {
  return Number.isInteger(points) ? points.toString() : points.toFixed(1);
}
