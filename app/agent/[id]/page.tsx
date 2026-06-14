import { notFound } from "next/navigation";
import { getAgentProfile } from "@/lib/api";
import { ScoreGauge } from "@/components/score-gauge";
import { RiskBadge } from "@/components/risk-badge";
import { ShieldIcon, BoltIcon, LinkIcon } from "@/components/icons";

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-text-dim">{label}</span>
        <span className="font-mono">
          {value} / {max}
        </span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-surface-2">
        <div
          className="h-1.5 rounded-full bg-accent transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgentProfile(id);

  if (!agent) notFound();

  const breakdown = agent.score_breakdown;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-start gap-5">
        <ScoreGauge score={agent.trust_score} size={72} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">
              {agent.name || `Agent #${agent.agent_id}`}
            </h1>
            <span className="font-mono text-sm text-text-dim">#{agent.agent_id}</span>
          </div>

          {agent.description && <p className="mt-1 text-text-dim">{agent.description}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <RiskBadge risk={agent.risk_level} />
            {agent.self_verification.verified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                <ShieldIcon className="h-3.5 w-3.5" /> Self verified
              </span>
            )}
            {agent.supports_x402 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-dim">
                <BoltIcon className="h-3.5 w-3.5" /> Pay per use
              </span>
            )}
            {agent.a2a_endpoint && (
              <a
                href={agent.a2a_endpoint}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-dim transition-colors hover:text-text"
              >
                <LinkIcon className="h-3.5 w-3.5" /> Visit API
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-medium">How this score is made up</h2>
          <div className="mt-4 space-y-4">
            <ScoreRow label="Time registered" value={breakdown.age} max={15} />
            <ScoreRow label="Profile quality" value={breakdown.card} max={20} />
            <ScoreRow label="Feedback from others" value={breakdown.reputation} max={35} />
            <ScoreRow label="Human verification" value={breakdown.self} max={20} />
            <ScoreRow label="Last check by TrustGuard" value={breakdown.probe} max={10} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-medium">Feedback from other agents</h2>
            {agent.reputation.total_feedback > 0 ? (
              <p className="mt-2 text-sm text-text-dim">
                {agent.reputation.total_feedback} review
                {agent.reputation.total_feedback === 1 ? "" : "s"}, averaging{" "}
                <span className="font-mono text-text">{agent.reputation.avg_score}</span> out of 100.
              </p>
            ) : (
              <p className="mt-2 text-sm text-text-dim">No feedback yet from other agents.</p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-medium">Identity</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-text-dim">Owner address</dt>
                <dd className="truncate font-mono text-xs">{agent.owner_address}</dd>
              </div>
              {agent.wallet_address && (
                <div className="flex justify-between gap-4">
                  <dt className="text-text-dim">Wallet</dt>
                  <dd className="truncate font-mono text-xs">{agent.wallet_address}</dd>
                </div>
              )}
              {agent.registered_at && (
                <div className="flex justify-between gap-4">
                  <dt className="text-text-dim">Registered</dt>
                  <dd>{new Date(agent.registered_at).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}