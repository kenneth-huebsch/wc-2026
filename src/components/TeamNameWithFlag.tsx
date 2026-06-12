import { teamFlagCodes } from '../domain/teamFlagCodes';

type TeamNameWithFlagProps = {
  teamId: string;
  teamName: string;
};

export function TeamNameWithFlag({ teamId, teamName }: TeamNameWithFlagProps) {
  const flagCode = teamFlagCodes[teamId];

  return (
    <span className="team-name-with-flag">
      {flagCode ? <span aria-hidden="true" className={`team-flag fi fi-${flagCode}`} /> : null}
      <span>{teamName}</span>
    </span>
  );
}
