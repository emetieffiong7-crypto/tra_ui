"use client";

import { AgentSummary, StreamEvent } from "@/lib/types";
import { AgentCard } from "./agent-card";

const TOOL_LABELS: Record<string, string> = {
  discover_agents: "Looking through registered agents",
  search_agents: "Searching by name",
  get_agent_profile: "Pulling up an agent's full profile",
  get_agent_score: "Checking trust score",
  verify_agent: "Testing the agent's endpoint",
  create_escrow: "Setting up a secured payment",
  check_escrow_status: "Checking payment status",
  release_escrow: "Releasing payment",
  execute_x402_payment: "Sending a pay-per-use request",
};

function collectAgents(events: StreamEvent[]): AgentSummary[] {
  const found: AgentSummary[] = [];
  const seen = new Set<number>();

  for (const event of events) {
    if (event.type !== "tool_result") continue;
    const result = event.result;
    const list: AgentSummary[] | undefined = result?.results;
    if (!Array.isArray(list)) continue;

    for (const agent of list) {
      if (agent?.agent_id != null && !seen.has(agent.agent_id)) {
        seen.add(agent.agent_id);
        found.push(agent);
      }
    }
  }

  return found;
}

export function StreamingAnswer({
  events,
  isStreaming,
}: {
  events: StreamEvent[];
  isStreaming: boolean;
}) {
  const complete = events.find((e) => e.type === "complete") as
    | (StreamEvent & { type: "complete" })
    | undefined;
  const error = events.find((e) => e.type === "error") as
    | (StreamEvent & { type: "error" })
    | undefined;

  const steps = events.filter(
    (e) => e.type === "tool_call" || e.type === "reasoning"
  );

  const agents = collectAgents(events);

  return (
    <div className="mt-8 space-y-6">
      {steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className="step-in flex items-start gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-dim"
            >
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {step.type === "tool_call" ? (
                <span>{TOOL_LABELS[step.tool] || `Using ${step.tool}`}…</span>
              ) : (
                <span className="text-text">{step.content}</span>
              )}
            </div>
          ))}

          {isStreaming && (
            <div className="step-in flex items-center gap-2 px-3 py-1 text-sm text-text-dim">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Thinking…
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="step-in rounded-md border border-high/30 bg-high/10 px-4 py-3 text-sm text-high">
          Something went wrong: {error.error}
        </div>
      )}

      {complete && (
        <div className="step-in rounded-lg border border-border bg-surface p-5">
          <p className="whitespace-pre-wrap leading-relaxed">{complete.response}</p>
        </div>
      )}

      {agents.length > 0 && (
        <div className="step-in space-y-3">
          <p className="text-sm text-text-dim">Agents mentioned in this answer</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {agents.map((agent) => (
              <AgentCard key={agent.agent_id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}