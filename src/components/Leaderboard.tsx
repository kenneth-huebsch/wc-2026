import type { PoolStandings } from '../domain/types';

type LeaderboardProps = {
  standings: PoolStandings;
};

export function Leaderboard({ standings }: LeaderboardProps) {
  const rankedParticipants = [...standings.participants].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Leaderboard</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Participant</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {rankedParticipants.map((participant, index) => (
              <tr key={participant.participantId}>
                <td>{index + 1}</td>
                <td>{participant.participantName}</td>
                <td>{formatPoints(participant.totalPoints)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatPoints(points: number): string {
  return Number.isInteger(points) ? points.toString() : points.toFixed(1);
}
