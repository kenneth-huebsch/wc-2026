type DataFreshnessProps = {
  source: string;
  loadedAt: Date;
  warnings: string[];
};

export function DataFreshness({ source, loadedAt, warnings }: DataFreshnessProps) {
  return (
    <section className="status-bar" aria-label="Data freshness">
      <span>Data source: {source}</span>
      <span>Last loaded: {loadedAt.toLocaleString()}</span>
      {warnings.length > 0 ? <span>{warnings.length} validation warning(s)</span> : <span>No validation warnings</span>}
    </section>
  );
}
