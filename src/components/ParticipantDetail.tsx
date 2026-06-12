import type { PoolStandings } from '../domain/types';

type ParticipantDetailProps = {
  standings: PoolStandings;
};

export function ParticipantDetail({ standings }: ParticipantDetailProps) {
  const participants = [...standings.participants].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Participant Detail</h2>
      </div>
      <div className="detail-grid">
        {participants.map((participant) => (
          <article className="detail-card" key={participant.participantId}>
            <h3>{participant.participantName}</h3>
            <p className="metric">{formatPoints(participant.totalPoints)} pts</p>
            <ul>
              {participant.teams.map((team) => (
                <li key={team.teamId}>
                  <span className="detail-name">{team.teamName}</span>
                  <span>
                    {formatPercent(team.ownership)}, {formatPoints(team.points)} pts
                  </span>
                </li>
              ))}
            </ul>
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
