export function RulesSummary() {
  return (
    <section className="card">
      <div className="section-heading">
        <h2>Rules</h2>
      </div>
      <ol className="rules-list">
        <li>Participants invest whole-dollar amounts in any teams they choose before the pool locks for a total of $50.</li>
        <li>Ownership is each participant&apos;s investment divided by the total invested in that team.</li>
        <li>Scoring starts when teams advance from the Group Stage.</li>
        <li>Group advancers keep their own team value and split the value of eliminated group teams.</li>
        <li>Each knockout match is winner-take-all: the winner earns and carries forward the sum of both teams&rsquo; values.</li>
        <li>Participant scores are the sum of ownership-adjusted points across all owned teams and across all stages.</li>
      </ol>
      <p className="rules-link">
        <a href="/WC26_PariMutuel_PoolRules.pdf" rel="noreferrer" target="_blank">
          Read the full pool rules PDF
        </a>
      </p>
    </section>
  );
}
