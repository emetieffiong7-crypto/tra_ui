import Link from "next/link";
import { AgentSummary } from "@/lib/types";
import { ScoreGauge } from "./score-gauge";
import { ShieldIcon, BoltIcon, LinkIcon } from "./icons";

export function AgentCard({ agent }: { agent: AgentSummary }) {
  return (
    <Link
      href={`/agent/${agent.agent_id}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/50 hover:bg-surface-2"
    >
      <ScoreGauge score={agent.trust_score} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">
            {agent.name || `Agent #${agent.agent_id}`}
          </p>
          <span className="font-mono text-xs text-text-dim">#{agent.agent_id}</span>
        </div>

        {agent.description && (
          <p className="mt-0.5 truncate text-sm text-text-dim">{agent.description}</p>
        )}

        <div className="mt-2 flex items-center gap-3 text-xs text-text-dim">
          {agent.self_verified && (
            <span className="inline-flex items-center gap-1 text-accent">
              <ShieldIcon className="h-3.5 w-3.5" /> Self verified
            </span>
          )}
          {agent.supports_x402 && (
            <span className="inline-flex items-center gap-1">
              <BoltIcon className="h-3.5 w-3.5" /> Pay per use
            </span>
          )}
          {agent.a2a_endpoint && (
            <span className="inline-flex items-center gap-1">
              <LinkIcon className="h-3.5 w-3.5" /> Has an API
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}