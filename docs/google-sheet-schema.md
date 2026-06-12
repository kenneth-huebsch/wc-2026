# Google Sheet Schema

The app expects each tab to be published as CSV and exposed through a Netlify environment variable.

## Participants

Environment variable: `VITE_PARTICIPANTS_CSV_URL`

| participant_id | name |
| --- | --- |
| alex | Alex |

## Teams

Environment variable: `VITE_TEAMS_CSV_URL`

| team_id | name | group |
| --- | --- | --- |
| france | France | I |

## Investments

Environment variable: `VITE_INVESTMENTS_CSV_URL`

| participant_id | team_id | amount |
| --- | --- | --- |
| alex | france | 25 |

Rules:

- `amount` must be a whole-dollar value.
- Participant and team ids must match rows from `Participants` and `Teams`.

## Group Results

Environment variable: `VITE_GROUP_RESULTS_CSV_URL`

| group | advancing_team_ids |
| --- | --- |
| I | france,senegal |

Rules:

- Leave this tab empty until group advancement is known.
- Use comma-separated team ids in advancement order.

## Matches

Environment variable: `VITE_MATCHES_CSV_URL`

| round | team_a_id | team_b_id | winner_team_id | played |
| --- | --- | --- | --- | --- |
| round-of-32 | france | scotland | france | true |

Allowed `round` values:

- `round-of-32`
- `round-of-16`
- `quarterfinal`
- `semifinal`
- `final`

Rules:

- Set `played` to `true` only after a result is final.
- Future fixtures can be present with `played` set to `false`.
