export default function ActivityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Activity</h1>
      <p className="mt-1 text-text-dim">
        A live feed of checks TrustGuard runs on agents across Celo.
      </p>

      <div className="mt-8 rounded-lg border border-dashed border-border bg-surface p-10 text-center text-text-dim">
        <p>Activity will start showing here as TrustGuard checks more agents.</p>
        <p className="mt-1 text-sm">Check back soon.</p>
      </div>
    </div>
  );
}