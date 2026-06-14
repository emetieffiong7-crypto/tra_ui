"use client";

import { useState } from "react";
import { AgentSummary } from "@/lib/types";
import { AgentTaskResult } from "@/lib/api";
import { AgentCard } from "./agent-card";
import { ChevronDownIcon } from "./icons";

const TOOL_LABELS: Record<string, string> = {
  discover_agents: "Looked through registered agents",
  search_agents: "Searched by name",
  get_agent_profile: "Pulled up an agent's full profile",
  get_agent_score: "Checked trust score",
  verify_agent: "Tested the agent's endpoint",
  create_escrow: "Set up a secured payment",
  check_escrow_status: "Checked payment status",
  release_escrow: "Released payment",
  execute_x402_payment: "Sent a pay-per-use request",
};

function collectAgents(toolCalls: AgentTaskResult["tool_calls_made"]): AgentSummary[] {
  const found: AgentSummary[] = [];
  const seen = new Set<number>();

  for (const call of toolCalls) {
    const list: AgentSummary[] | undefined = call.result?.results;
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

export function AnswerResult({ result }: { result: AgentTaskResult }) {
  const [expanded, setExpanded] = useState(false);
  const agents = collectAgents(result.tool_calls_made);

  return (
    <div className="mt-8 space-y-4 text-left">
      <div className="step-in rounded-lg border border-border bg-surface p-5">
        <p className="whitespace-pre-wrap leading-relaxed">{result.response}</p>
      </div>

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

      {result.tool_calls_made.length > 0 && (
        <div className="step-in rounded-lg border border-border bg-surface">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-text-dim"
          >
            <span>
              Checked {result.tool_calls_made.length} thing
              {result.tool_calls_made.length === 1 ? "" : "s"} to answer this
            </span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {expanded && (
            <div className="space-y-1.5 border-t border-border px-4 py-3">
              {result.tool_calls_made.map((call, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-dim">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                  <span>{TOOL_LABELS[call.tool] || `Used ${call.tool}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}