// "use client";

// import { useEffect, useRef, useState } from "react";
// import { runAgentTask, AgentTaskResult } from "@/lib/api";
// import { AnswerResult } from "./answer-result";
// import { SearchIcon, ArrowRightIcon } from "./icons";

// const EXAMPLES = [
//   "Find a trustworthy payments agent on Celo",
//   "Tell me about agent 9051",
//   "Which agents are Self verified?",
//   "Search for an agent called Soma",
// ];

// const LOADING_MESSAGES = [
//   "Searching the agent registry…",
//   "Checking trust scores…",
//   "Looking at verification status…",
//   "Putting together an answer…",
// ];

// export function SearchHero() {
//   const [query, setQuery] = useState("");
//   const [result, setResult] = useState<AgentTaskResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingStep, setLoadingStep] = useState(0);
//   const [error, setError] = useState("");
//   const abortRef = useRef<AbortController | null>(null);

//   useEffect(() => {
//     if (!loading) return;
//     setLoadingStep(0);
//     const interval = setInterval(() => {
//       setLoadingStep((s) => (s + 1) % LOADING_MESSAGES.length);
//     }, 3500);
//     return () => clearInterval(interval);
//   }, [loading]);

//   async function runSearch(task: string) {
//     if (!task.trim() || loading) return;

//     abortRef.current?.abort();
//     const controller = new AbortController();
//     abortRef.current = controller;

//     setQuery(task);
//     setResult(null);
//     setError("");
//     setLoading(true);

//     try {
//       const data = await runAgentTask(task, controller.signal);
//       setResult(data);
//     } catch {
//       if (!controller.signal.aborted) {
//         setError("Could not reach TrustGuard. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="relative overflow-hidden">
//       <div className="grid-backdrop absolute inset-0 -z-10" />
//       <div className="glow-orb absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

//       <div className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:pt-28">
//         <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
//           Ask about any agent on Celo
//         </h1>
//         <p className="mt-4 text-text-dim sm:text-lg">
//           TrustGuard checks reputation, verification and live activity —
//           then tells you what it finds.
//         </p>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             runSearch(query);
//           }}
//           className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-surface p-2 pl-5 shadow-lg shadow-black/20 transition-shadow focus-within:border-accent/60 focus-within:shadow-accent/10"
//         >
//           <SearchIcon className="h-5 w-5 shrink-0 text-text-dim" />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="e.g. find a reliable agent that handles payments"
//             className="w-full bg-transparent text-sm outline-none placeholder:text-text-dim sm:text-base"
//           />
//           <button
//             type="submit"
//             disabled={loading || !query.trim()}
//             className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-40"
//             aria-label="Ask TrustGuard"
//           >
//             <ArrowRightIcon className="h-4 w-4" />
//           </button>
//         </form>

//         <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
//           {EXAMPLES.map((example) => (
//             <button
//               key={example}
//               onClick={() => runSearch(example)}
//               disabled={loading}
//               className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-dim transition-colors hover:border-accent/40 hover:text-text disabled:opacity-40"
//             >
//               {example}
//             </button>
//           ))}
//         </div>

//         {loading && (
//           <div className="mt-10 flex flex-col items-center gap-3 text-text-dim">
//             <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
//             <p className="text-sm">{LOADING_MESSAGES[loadingStep]}</p>
//           </div>
//         )}

//         {error && (
//           <div className="mt-8 rounded-md border border-high/30 bg-high/10 px-4 py-3 text-sm text-high">
//             {error}
//           </div>
//         )}

//         {result && <AnswerResult result={result} />}
//       </div>
//     </section>
//   );
// }

"use client";

import { useRef, useState } from "react";
import { runAgentTask, AgentTaskResult } from "@/lib/api";
import { AnswerResult } from "./answer-result";
import { SearchIcon, ArrowRightIcon } from "./icons";

const EXAMPLES = [
  "Find a trustworthy payments agent on Celo",
  "Tell me about agent 9051",
  "Which agents are Self verified?",
  "Search for an agent called Soma",
];

export function SearchHero() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AgentTaskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function runSearch(task: string) {
    if (!task.trim() || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setQuery(task);
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const data = await runAgentTask(task, controller.signal);
      setResult(data);
    } catch {
      if (!controller.signal.aborted)
        setError("Could not reach TrustGuard. Please try again.");
    } finally {
      setLoading(false);
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
          TrustGuard checks reputation, verification and live activity —
          then tells you what it finds.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
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
            disabled={loading || !query.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-40"
          >
            {loading
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg/40 border-t-bg" />
              : <ArrowRightIcon className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => runSearch(ex)} disabled={loading}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-dim transition-colors hover:border-accent/40 hover:text-text disabled:opacity-40">
              {ex}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-10 flex flex-col items-center gap-3 text-text-dim">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-sm animate-pulse">Checking the agent registry…</p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-md border border-high/30 bg-high/10 px-4 py-3 text-sm text-high">
            {error}
          </div>
        )}

        {result && <AnswerResult result={result} />}
      </div>
    </section>
  );
}