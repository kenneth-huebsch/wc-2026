import type { PoolStandings } from '../domain/types';
import { TeamNameWithFlag } from './TeamNameWithFlag';

type ParticipantDetailProps = {
  standings: PoolStandings;
};

export function ParticipantDetail({ standings }: ParticipantDetailProps) {
  const participants = [...standings.participants].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Participants</h2>
      </div>
      <div className="detail-grid">
        {participants.map((participant) => (
          <article className="detail-card" key={participant.participantId}>
            <div className="detail-card-heading">
              <h3>{participant.participantName}</h3>
              <p className="metric">{formatPoints(participant.totalPoints)} pts</p>
            </div>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>% Owned</th>
                  <th>Points Earned</th>
                </tr>
              </thead>
              <tbody>
                {[...participant.teams].sort((a, b) => b.points - a.points).map((team) => (
                  <tr key={team.teamId}>
                    <td className="detail-name">
                      <TeamNameWithFlag teamId={team.teamId} teamName={team.teamName} />
                    </td>
                    <td>{formatPercent(team.ownership)}</td>
                    <td>{formatPoints(team.points)} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
