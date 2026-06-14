export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>TrustGuard — keeping an eye on agents across Celo.</p>
        <p className="font-mono text-xs">Built for the Celo Onchain Agents Hackathon</p>
      </div>
    </footer>
  );
}