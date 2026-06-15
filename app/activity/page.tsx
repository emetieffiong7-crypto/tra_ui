"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentActivity } from "@/lib/api";
import { ActivityItem } from "@/lib/types";

const EXPLORER_BASE = process.env.NEXT_PUBLIC_CELO_EXPLORER_URL || "https://celoscan.io";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getRecentActivity(30);
        if (active) setItems(data.activity);
      } catch {
        if (active) setError("Could not load activity right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Activity</h1>
      <p className="mt-1 text-text-dim">
        A live feed of checks TrustGuard runs on agents across Celo.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-text-dim">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-high">{error}</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-surface p-10 text-center text-text-dim">
          <p>No checks yet.</p>
          <p className="mt-1 text-sm">
            Activity shows up here whenever TrustGuard checks an agent's endpoint —
            try asking about an agent on the home page.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  item.passed ? "bg-low" : "bg-high"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/agent/${item.agent_id}`}
                    className="font-medium transition-colors hover:text-accent"
                  >
                    {item.agent_name || `Agent #${item.agent_id}`}
                  </Link>
                  <span className="shrink-0 text-xs text-text-dim">{timeAgo(item.probed_at)}</span>
                </div>
                <p className="mt-1 text-sm text-text-dim">
                  {item.passed ? "Endpoint check passed" : "Endpoint check failed"}
                  {item.trust_score != null && ` · Trust score ${item.trust_score}/100`}
                </p>
                {item.posted_onchain && item.tx_hash && (
                  <a
                    href={`${EXPLORER_BASE}/tx/${item.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-xs text-accent hover:underline"
                  >
                    View onchain record →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}