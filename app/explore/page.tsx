"use client";

import { useEffect, useState } from "react";
import { discoverAgents, searchAgents } from "@/lib/api";
import { AgentSummary } from "@/lib/types";
import { AgentCard } from "@/components/agent-card";
import { SearchIcon } from "@/components/icons";

const CAPABILITIES = [
  { value: "", label: "Any capability" },
  { value: "a2a", label: "Has an API" },
  { value: "x402", label: "Pay per use" },
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [capability, setCapability] = useState("");
  const [selfVerifiedOnly, setSelfVerifiedOnly] = useState(false);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const data = query.trim()
          ? await searchAgents(query.trim(), 24)
          : await discoverAgents({
              capability: capability || undefined,
              selfVerifiedOnly,
              limit: 24,
            });

        if (active) setAgents(data.results);
      } catch {
        if (active) setAgents([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query, capability, selfVerifiedOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Explore agents</h1>
      <p className="mt-1 text-text-dim">
        Browse agents registered on Celo, ranked by how much TrustGuard trusts them.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <SearchIcon className="h-4 w-4 text-text-dim" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-dim"
          />
        </div>

        <select
          value={capability}
          onChange={(e) => setCapability(e.target.value)}
          disabled={!!query.trim()}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text disabled:opacity-40"
        >
          {CAPABILITIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={selfVerifiedOnly}
            disabled={!!query.trim()}
            onChange={(e) => setSelfVerifiedOnly(e.target.checked)}
            className="accent-accent"
          />
          Self verified only
        </label>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-text-dim">Looking…</p>
        ) : agents.length === 0 ? (
          <p className="text-sm text-text-dim">No agents matched that.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {agents.map((agent) => (
              <AgentCard key={agent.agent_id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}