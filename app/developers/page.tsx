"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api-docs";
import { EndpointDoc } from "@/components/endpoint-doc";

type Mode = "developer" | "agent";

export default function DevelopersPage() {
  const [mode, setMode] = useState<Mode>("developer");
  const [label, setLabel] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [agentId, setAgentId] = useState("");
  const [result, setResult] = useState<{ key: string; rate_limit: string } | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { registerApiKey } = await import("@/lib/api");
      const data = await registerApiKey({
        label: mode === "agent" ? `Agent #${agentId}` : label,
        email: mode === "developer" ? email : undefined,
        purpose: mode === "developer" ? purpose : "agent self-registration",
      });
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Get an API key</h1>
      <p className="mt-1 text-text-dim">
        Use TrustGuard's API to check agents, route payments, and ask questions in plain language.
      </p>

      <div className="mt-6 inline-flex rounded-full border border-border bg-surface p-1 text-sm">
        {(["developer", "agent"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setResult(null);
              setError("");
            }}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              mode === m ? "bg-accent text-bg" : "text-text-dim hover:text-text"
            }`}
          >
            {m === "developer" ? "I'm building something" : "I'm an agent"}
          </button>
        ))}
      </div>

      {result ? (
        <div className="mt-8 rounded-lg border border-accent/30 bg-accent/10 p-5">
          <p className="text-sm text-text-dim">Here is your key — save it now, it won't be shown again.</p>
          <p className="mt-2 break-all rounded bg-surface-2 px-3 py-2 font-mono text-sm">{result.key}</p>
          <p className="mt-3 text-sm text-text-dim">
            Rate limit: <span className="text-text">{result.rate_limit}</span>. Send it as the{" "}
            <span className="font-mono text-text">x-trustguard-api-key</span> header.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "developer" ? (
            <>
              <div>
                <label className="block text-sm text-text-dim">Your name or project</label>
                <input
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent/50"
                  placeholder="e.g. John Doe - AgentZ"
                />
              </div>
              <div>
                <label className="block text-sm text-text-dim">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-text-dim">What are you building? (optional)</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent/50"
                  placeholder="A quick line about your project helps us a lot"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-text-dim">Your agent ID on Celo</label>
              <input
                required
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent/50"
                placeholder="e.g. 9051"
              />
              <p className="mt-2 text-xs text-text-dim">
                Your access level is based on your TrustGuard score — agents with stronger
                reputations get higher limits automatically.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-high">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg transition-opacity disabled:opacity-50"
          >
            {submitting ? "Creating your key…" : "Get my key"}
          </button>
        </form>
      )}

      <div className="mt-14">
        <h2 className="text-xl font-semibold">API reference</h2>
        <p className="mt-1 text-text-dim">
          Everything below works with or without a key — a key just raises your limits and
          unlocks onchain actions.
        </p>

        <div className="mt-4 space-y-2">
          {ENDPOINTS.map((endpoint) => (
            <EndpointDoc key={endpoint.method + endpoint.path} endpoint={endpoint} />
          ))}
        </div>

        <p className="mt-4 text-sm text-text-dim">
          Full interactive reference at{" "}
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            {API_BASE_URL}/docs
          </a>
        </p>
      </div>
    </div>
  );
}