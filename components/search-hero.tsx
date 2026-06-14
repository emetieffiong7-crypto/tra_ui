"use client";

import { useState, useRef } from "react";
import { streamAgentTask } from "@/lib/api";
import { StreamEvent } from "@/lib/types";
import { StreamingAnswer } from "./streaming-answer";
import { SearchIcon, ArrowRightIcon } from "./icons";

const EXAMPLES = [
  "Find a trustworthy payments agent on Celo",
  "Tell me about agent 9051",
  "Which agents are Self verified?",
  "Search for an agent called Soma",
];

export function SearchHero() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function runSearch(task: string) {
    if (!task.trim() || isStreaming) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setQuery(task);
    setEvents([]);
    setIsStreaming(true);

    try {
      await streamAgentTask(
        task,
        (event) => setEvents((prev) => [...prev, event]),
        controller.signal
      );
    } catch (err) {
      if (!controller.signal.aborted) {
        setEvents((prev) => [
          ...prev,
          { type: "error", error: "Could not reach TrustGuard. Please try again." },
        ]);
      }
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="grid-backdrop absolute inset-0 -z-10" />
      <div className="glow-orb absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:pt-28">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Ask about any agent on Celo
        </h1>
        <p className="mt-4 text-text-dim sm:text-lg">
          TrustGuard checks reputation, verification, and live activity —
          then tells you what it finds.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
          className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-surface p-2 pl-5 shadow-lg shadow-black/20 transition-shadow focus-within:border-accent/60 focus-within:shadow-accent/10"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-text-dim" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. find a reliable agent that handles payments"
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-dim sm:text-base"
          />
          <button
            type="submit"
            disabled={isStreaming || !query.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-40"
            aria-label="Ask TrustGuard"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => runSearch(example)}
              disabled={isStreaming}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-dim transition-colors hover:border-accent/40 hover:text-text disabled:opacity-40"
            >
              {example}
            </button>
          ))}
        </div>

        {events.length > 0 && <StreamingAnswer events={events} isStreaming={isStreaming} />}
      </div>
    </section>
  );
}