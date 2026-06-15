// "use client";

// import { useState } from "react";
// import { AgentSummary } from "@/lib/types";
// import { AgentTaskResult } from "@/lib/api";
// import { AgentCard } from "./agent-card";
// import { ArrowRightIcon, ChevronDownIcon, LinkIcon } from "./icons";
// import Link from "next/link";

// const TOOL_LABELS: Record<string, string> = {
//   discover_agents:       "Looked through registered agents",
//   search_agents:         "Searched by name",
//   get_agent_profile:     "Pulled up an agent's full profile",
//   get_agent_score:       "Checked trust score",
//   verify_agent:          "Tested the agent's endpoint",
//   create_escrow:         "Set up a secured payment",
//   check_escrow_status:   "Checked payment status",
//   release_escrow:        "Released payment",
//   execute_x402_payment:  "Sent a pay-per-use request",
// };

// const EXPLORER_BASE = "https://celo.blockscout.com"
// const RISK_COLORS: Record<string, string> = {
//   LOW:     "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
//   MEDIUM:  "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
//   HIGH:    "text-red-400 bg-red-400/10 border-red-400/20",
//   UNKNOWN: "text-text-dim bg-surface border-border",
// };

// function ScoreBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
//   const pct = Math.min((value / max) * 100, 100);
//   return (
//     <div className="space-y-1">
//       <div className="flex justify-between text-xs text-text-dim">
//         <span>{label}</span>
//         <span>{value}</span>
//       </div>
//       <div className="h-1.5 rounded-full bg-border overflow-hidden">
//         <div
//           className="h-full rounded-full bg-text-dim transition-all"
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// // function AgentProfileCard({ result }: { result: Record<string, any> }) {
// //   const risk = result.risk_level ?? "UNKNOWN";
// //   const riskClass = RISK_COLORS[risk] ?? RISK_COLORS.UNKNOWN;
// //   const breakdown = result.score_breakdown ?? {};

// //   return (
// //     <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
// //       {/* Header row */}
// //       <div className="flex items-start justify-between gap-3">
// //         <div className="space-y-0.5">
// //           <div className="flex items-center gap-2">
// //             <span className="font-mono text-sm font-medium">
// //               Agent #{result.agent_id}
// //             </span>
// //             {result.self_verified && (
// //               <span className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 text-xs text-emerald-400">
// //                 Self Verified
// //               </span>
// //             )}
// //             {result.is_blacklisted && (
// //               <span className="rounded-full bg-red-400/10 border border-red-400/20 px-2 py-0.5 text-xs text-red-400">
// //                 Blacklisted
// //               </span>
// //             )}
// //           </div>
// //           {result.owner_address && (
// //             <p className="font-mono text-xs text-text-dim truncate max-w-xs">
// //               {result.owner_address}
// //             </p>
// //           )}
// //         </div>

// //         <div className="text-right shrink-0 space-y-1">
// //           <div className="text-2xl font-semibold tabular-nums">
// //             {result.trust_score ?? "—"}
// //             <span className="text-sm font-normal text-text-dim">/100</span>
// //           </div>
// //           <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${riskClass}`}>
// //             {risk} RISK
// //           </span>
// //         </div>
// //       </div>

// //       {/* Score breakdown */}
// //       {Object.keys(breakdown).length > 0 && (
// //         <div className="space-y-2 pt-1 border-t border-border">
// //           <p className="text-xs text-text-dim uppercase tracking-wide">Score breakdown</p>
// //           {Object.entries(breakdown)
// //             .filter(([k]) => k !== "total")
// //             .map(([k, v]) => (
// //               <ScoreBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={Number(v)} max={20} />
// //             ))}
// //         </div>
// //       )}

// //       {/* Capabilities row */}
// //       <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-border text-sm">
// //         <div className="flex justify-between">
// //           <span className="text-text-dim">x402 payments</span>
// //           <span className={result.supports_x402 ? "text-emerald-400" : "text-text-dim"}>
// //             {result.supports_x402 ? "Yes" : "No"}
// //           </span>
// //         </div>
// //         <div className="flex justify-between">
// //           <span className="text-text-dim">A2A endpoint</span>
// //           <span className={result.a2a_endpoint ? "text-emerald-400" : "text-text-dim"}>
// //             {result.a2a_endpoint ? "Yes" : "No"}
// //           </span>
// //         </div>
// //         <div className="flex justify-between">
// //           <span className="text-text-dim">Failures</span>
// //           <span className={result.consecutive_failures > 0 ? "text-red-400" : "text-text-dim"}>
// //             {result.consecutive_failures ?? 0}
// //           </span>
// //         </div>
// //         <div className="flex justify-between">
// //           <span className="text-text-dim">Avg feedback</span>
// //           <span className="text-text-dim">
// //             {result.reputation?.avg_score ?? 0} ({result.reputation?.total_feedback ?? 0})
// //           </span>
// //         </div>
// //       </div>

// //       {/* Recommendation */}
// //       {result.recommendation && (
// //         <p className="text-xs text-text-dim border-t border-border pt-3 italic">
// //           {result.recommendation}
// //         </p>
// //       )}
// //     </div>
// //   );
// // }

// function AgentProfileCard({ result }: { result: Record<string, any> }) {
//   const risk = result.risk_level ?? "UNKNOWN";
//   const riskClass = RISK_COLORS[risk] ?? RISK_COLORS.UNKNOWN;
//   const breakdown = result.score_breakdown ?? {};

//   return (
//     <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
//       {/* Header row */}
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0 space-y-1">
//           <div className="flex flex-wrap items-center gap-2">
//             <Link
//               href={`/agent/${result.agent_id}`}
//               className="font-medium transition-colors hover:text-accent"
//             >
//               {result.name || `Agent #${result.agent_id}`}
//             </Link>
//             <span className="font-mono text-xs text-text-dim">#{result.agent_id}</span>
//             {result.self_verified && (
//               <span className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 text-xs text-emerald-400">
//                 Self Verified
//               </span>
//             )}
//             {result.is_blacklisted && (
//               <span className="rounded-full bg-red-400/10 border border-red-400/20 px-2 py-0.5 text-xs text-red-400">
//                 Blacklisted
//               </span>
//             )}
//           </div>

//           {result.description && (
//             <p className="line-clamp-2 text-sm text-text-dim">{result.description}</p>
//           )}

//           {result.owner_address && (
//             <a
//               href={`${EXPLORER_BASE}/address/${result.owner_address}`}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-block max-w-xs truncate font-mono text-xs text-text-dim transition-colors hover:text-accent"
//             >
//               {result.owner_address}
//             </a>
//           )}
//         </div>

//         <div className="shrink-0 space-y-1 text-right">
//           <div className="text-2xl font-semibold tabular-nums">
//             {result.trust_score ?? "—"}
//             <span className="text-sm font-normal text-text-dim">/100</span>
//           </div>
//           <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${riskClass}`}>
//             {risk} RISK
//           </span>
//         </div>
//       </div>

//       {/* Score breakdown */}
//       {Object.keys(breakdown).length > 0 && (
//         <div className="space-y-2 border-t border-border pt-1">
//           <p className="text-xs uppercase tracking-wide text-text-dim">Score breakdown</p>
//           {Object.entries(breakdown)
//             .filter(([k]) => k !== "total")
//             .map(([k, v]) => (
//               <ScoreBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={Number(v)} max={20} />
//             ))}
//         </div>
//       )}

//       {/* Capabilities row */}
//       <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-1 text-sm">
//         <div className="flex justify-between">
//           <span className="text-text-dim">x402 payments</span>
//           <span className={result.supports_x402 ? "text-emerald-400" : "text-text-dim"}>
//             {result.supports_x402 ? "Yes" : "No"}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-text-dim">A2A endpoint</span>
//           <span className={result.a2a_endpoint ? "text-emerald-400" : "text-text-dim"}>
//             {result.a2a_endpoint ? "Yes" : "No"}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-text-dim">Failures</span>
//           <span className={result.consecutive_failures > 0 ? "text-red-400" : "text-text-dim"}>
//             {result.consecutive_failures ?? 0}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-text-dim">Avg feedback</span>
//           <span className="text-text-dim">
//             {result.reputation?.avg_score ?? 0} ({result.reputation?.total_feedback ?? 0})
//           </span>
//         </div>
//       </div>

//       {/* Quick links */}
//       <div className="flex items-center gap-4 border-t border-border pt-3 text-sm">
//         <Link
//           href={`/agent/${result.agent_id}`}
//           className="inline-flex items-center gap-1 text-accent hover:underline"
//         >
//           View full profile <ArrowRightIcon className="h-3.5 w-3.5" />
//         </Link>
//         {result.a2a_endpoint && (
//           <a
//             href={result.a2a_endpoint}
//             target="_blank"
//             rel="noreferrer"
//             className="inline-flex items-center gap-1 text-text-dim transition-colors hover:text-text"
//           >
//             <LinkIcon className="h-3.5 w-3.5" /> Open agent's API
//           </a>
//         )}
//       </div>

//       {/* Recommendation */}
//       {result.recommendation && (
//         <p className="border-t border-border pt-3 text-xs italic text-text-dim">
//           {result.recommendation}
//         </p>
//       )}
//     </div>
//   );
// }

// // function DiscoveryResultCard({ result }: { result: Record<string, any> }) {
// //   if (!result.found || !Array.isArray(result.results) || result.results.length === 0) {
// //     return (
// //       <p className="text-sm text-text-dim italic">
// //         {result.message ?? "No results found."}
// //       </p>
// //     );
// //   }

// //   return (
// //     <div className="space-y-2">
// //       <p className="text-xs text-text-dim">{result.total} agent{result.total !== 1 ? "s" : ""} found</p>
// //       <div className="grid gap-3 sm:grid-cols-2">
// //         {result.results.slice(0, 6).map((agent: AgentSummary) => (
// //           <AgentCard key={agent.agent_id} agent={agent} />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// function DiscoveryResultCard({ result }: { result: Record<string, any> }) {
//   if (!Array.isArray(result.results) || result.results.length === 0) {
//     return (
//       <p className="text-sm text-text-dim italic">
//         {result.message || result.note || "No agents matched this."}
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <p className="text-xs text-text-dim">
//           {result.total} agent{result.total !== 1 ? "s" : ""} found
//         </p>
//         {result.total > 6 && (
//           <Link href="/explore" className="text-xs text-accent hover:underline">
//             View all in Explore →
//           </Link>
//         )}
//       </div>
//       <div className="grid gap-3 sm:grid-cols-2">
//         {result.results.slice(0, 6).map((agent: AgentSummary) => (
//           <AgentCard key={agent.agent_id} agent={agent} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function ToolResultPanel({ call, allCalls }: { 
//   call: AgentTaskResult["tool_calls_made"][0];
//   allCalls: AgentTaskResult["tool_calls_made"];
// }) {
//   const r = call.result;
//   if (!r) return null;

//   if (call.tool === "get_agent_profile" && r.found) {
//     // Enrich with name/description from search_agents if available
//     const searchCall = allCalls.find(c => c.tool === "search_agents" && Array.isArray(c.result?.results));
//     const searchMatch = searchCall?.result?.results?.find((a: any) => a.agent_id === r.agent_id);
//     const enriched = { ...r, name: r.name ?? searchMatch?.name, description: searchMatch?.description };
//     return <AgentProfileCard result={enriched} />;
//   }

//   // Discovery / search tools
//   if (
//     (call.tool === "discover_agents" || call.tool === "search_agents") &&
//     Array.isArray(r.results)
//   ) {
//     return <DiscoveryResultCard result={r} />;
//   }

//   // Escrow
//   if (call.tool === "create_escrow" || call.tool === "check_escrow_status") {
//     return (
//       <pre className="rounded-lg bg-surface border border-border p-3 text-xs overflow-x-auto text-text-dim">
//         {JSON.stringify(r, null, 2)}
//       </pre>
//     );
//   }

//   return null;
// }

// function collectAgents(toolCalls: AgentTaskResult["tool_calls_made"]): AgentSummary[] {
//   const found: AgentSummary[] = [];
//   const seen = new Set<number>();

//   for (const call of toolCalls) {
//     const list: AgentSummary[] | undefined = call.result?.results;
//     if (!Array.isArray(list)) continue;
//     for (const agent of list) {
//       if (agent?.agent_id != null && !seen.has(agent.agent_id)) {
//         seen.add(agent.agent_id);
//         found.push(agent);
//       }
//     }
//   }

//   return found;
// }

// export function AnswerResult({ result }: { result: AgentTaskResult }) {
//     console.log("AnswerResult response:", result.response);
//     console.log("AnswerResult tool_calls:", result.tool_calls_made.length);
//      const [expanded, setExpanded] = useState(false);

//   // Collect rich panel results — profile cards, discovery grids, etc.
// //   const richResults = result.tool_calls_made.filter((call) => {
// //     const r = call.result;
// //     if (!r) return false;
// //     if (call.tool === "get_agent_profile" && r.found) return true;
// //     if ((call.tool === "discover_agents" || call.tool === "search_agents") && Array.isArray(r.results) && r.results.length > 0) return true;
// //     if (call.tool === "create_escrow" || call.tool === "check_escrow_status") return true;
// //     return false;
// //   });
// // Replace the richResults filter with this:
//     const richResults = (() => {
//         const calls = result.tool_calls_made;
//         const seen = new Set<string>();
//         const out: typeof calls = [];

//         // Prefer get_agent_profile over search_agents for same agent
//         const profileAgentIds = new Set(
//             calls
//                 .filter(c => c.tool === "get_agent_profile" && c.result?.found)
//                 .map(c => c.result.agent_id)
//         );

//         for (const call of calls) {
//             const r = call.result;
//             if (!r) continue;

//             if (call.tool === "get_agent_profile" && r.found) {
//                 const key = `profile-${r.agent_id}`;
//                 if (!seen.has(key)) { seen.add(key); out.push(call); }
//                 continue;
//             }

//             // Skip search_agents results whose agents are already shown via profile card
//             if (call.tool === "search_agents" && Array.isArray(r.results)) {
//                 const allCovered = r.results.every((a: any) => profileAgentIds.has(a.agent_id));
//                 if (allCovered) continue;
//                 const key = `search-${JSON.stringify(r.results.map((a: any) => a.agent_id))}`;
//                 if (!seen.has(key)) { seen.add(key); out.push(call); }
//                 continue;
//             }

//             if (call.tool === "discover_agents" && Array.isArray(r.results) && r.results.length > 0) {
//                 out.push(call);
//             }

//             if (call.tool === "create_escrow" || call.tool === "check_escrow_status") {
//                 out.push(call);
//             }
//         }

//         return out;
//     })();

//   // Fall back to agent cards for discover results without rich panel
//   const agents = richResults.length === 0 ? collectAgents(result.tool_calls_made) : [];

//   return (
//     <div className="mt-8 space-y-4 text-left">
//       {/* LLM summary */}
//       <div className="step-in rounded-lg border border-border bg-surface p-5">
//         <p className="whitespace-pre-wrap leading-relaxed">{result.response}</p>
//       </div>

//       {/* Rich structured results from tool calls */}
//       {richResults.length > 0 && (
//         <div className="step-in space-y-3">
//           {richResults.map((call, i) => (
//             <div key={i}>
//               <p className="text-xs text-text-dim mb-2 uppercase tracking-wide">
//                 {TOOL_LABELS[call.tool] ?? call.tool}
//               </p>
//               <ToolResultPanel call={call} allCalls={result.tool_calls_made} />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Fallback agent cards */}
//       {agents.length > 0 && (
//         <div className="step-in space-y-3">
//           <p className="text-sm text-text-dim">Agents mentioned in this answer</p>
//           <div className="grid gap-3 sm:grid-cols-2">
//             {agents.map((agent) => (
//               <AgentCard key={agent.agent_id} agent={agent} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Tool trace — collapsible */}
//       {result.tool_calls_made.length > 0 && (
//         <div className="step-in rounded-lg border border-border bg-surface">
//           <button
//             onClick={() => setExpanded((v) => !v)}
//             className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-text-dim"
//           >
//             <span>
//               Checked {result.tool_calls_made.length} thing
//               {result.tool_calls_made.length === 1 ? "" : "s"} · {result.iterations} iteration
//               {result.iterations === 1 ? "" : "s"} · {result.model}
//             </span>
//             <ChevronDownIcon
//               className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
//             />
//           </button>

//           {expanded && (
//             <div className="space-y-1.5 border-t border-border px-4 py-3">
//               {result.tool_calls_made.map((call, i) => (
//                 <div key={i} className="flex items-start gap-2.5 text-sm text-text-dim">
//                   <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
//                   <span>{TOOL_LABELS[call.tool] || `Used ${call.tool}`}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { AgentTaskResult } from "@/lib/api";
import { AgentCard } from "./agent-card";
import { AgentSummary } from "@/lib/types";
import { ChevronDownIcon, ArrowRightIcon, LinkIcon } from "./icons";
import Link from "next/link";

const EXPLORER_BASE = "https://celo.blockscout.com";

const TOOL_LABELS: Record<string, string> = {
  discover_agents:      "Searched the agent registry",
  search_agents:        "Searched by name",
  get_agent_profile:    "Pulled agent profile",
  get_agent_score:      "Checked trust score",
  verify_agent:         "Tested agent endpoint",
  create_escrow:        "Created escrow payment",
  check_escrow_status:  "Checked escrow status",
  release_escrow:       "Released payment",
  execute_x402_payment: "Sent x402 payment",
};

const RISK_COLORS: Record<string, string> = {
  LOW:      "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  MEDIUM:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  MODERATE: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  HIGH:     "text-red-400   bg-red-400/10   border-red-400/20",
  UNKNOWN:  "text-text-dim  bg-surface       border-border",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min((value / 20) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-dim">
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full bg-accent/60 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AgentProfileCard({ r, extra }: { r: Record<string, any>; extra?: Record<string, any> }) {
  const risk = r.risk_level ?? "UNKNOWN";
  const name = r.name ?? extra?.name;
  const description = r.description ?? extra?.description;

  return (
    <div className="rounded-lg border border-border bg-surface p-4 space-y-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/agent/${r.agent_id}`} className="font-medium hover:text-accent transition-colors">
              {name || `Agent #${r.agent_id}`}
            </Link>
            <span className="font-mono text-xs text-text-dim">#{r.agent_id}</span>
            {r.self_verified && (
              <span className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 text-xs text-emerald-400">Self Verified</span>
            )}
            {r.is_blacklisted && (
              <span className="rounded-full bg-red-400/10 border border-red-400/20 px-2 py-0.5 text-xs text-red-400">Blacklisted</span>
            )}
          </div>
          {description && <p className="line-clamp-2 text-sm text-text-dim">{description}</p>}
          {r.owner_address && (
            <a href={`${EXPLORER_BASE}/address/${r.owner_address}`} target="_blank" rel="noreferrer"
              className="inline-block max-w-xs truncate font-mono text-xs text-text-dim hover:text-accent transition-colors">
              {r.owner_address}
            </a>
          )}
        </div>
        <div className="shrink-0 text-right space-y-1">
          <div className="text-2xl font-semibold tabular-nums">
            {r.trust_score ?? "—"}<span className="text-sm font-normal text-text-dim">/100</span>
          </div>
          <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[risk] ?? RISK_COLORS.UNKNOWN}`}>
            {risk} RISK
          </span>
        </div>
      </div>

      {r.score_breakdown && Object.keys(r.score_breakdown).length > 0 && (
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs uppercase tracking-wide text-text-dim">Score breakdown</p>
          {Object.entries(r.score_breakdown).filter(([k]) => k !== "total").map(([k, v]) => (
            <ScoreBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={Number(v)} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-sm">
        {[
          ["x402 payments", r.supports_x402 ? "Yes" : "No", r.supports_x402],
          ["A2A endpoint",  r.a2a_endpoint  ? "Yes" : "No", r.a2a_endpoint],
          ["Failures",      r.consecutive_failures ?? 0,     r.consecutive_failures > 0],
          ["Avg feedback",  `${r.reputation?.avg_score ?? 0} (${r.reputation?.total_feedback ?? 0})`, false],
        ].map(([label, val, isAlert]) => (
          <div key={String(label)} className="flex justify-between">
            <span className="text-text-dim">{label}</span>
            <span className={isAlert ? "text-red-400" : val === "Yes" ? "text-emerald-400" : "text-text-dim"}>{String(val)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-3 text-sm">
        <Link href={`/agent/${r.agent_id}`} className="inline-flex items-center gap-1 text-accent hover:underline">
          View full profile <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
        {r.a2a_endpoint && (
          <a href={r.a2a_endpoint} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-text-dim hover:text-text transition-colors">
            <LinkIcon className="h-3.5 w-3.5" /> Agent API
          </a>
        )}
      </div>

      {r.recommendation && (
        <p className="border-t border-border pt-3 text-xs italic text-text-dim">{r.recommendation}</p>
      )}
    </div>
  );
}

function DiscoveryCard({ r }: { r: Record<string, any> }) {
  if (!Array.isArray(r.results) || r.results.length === 0)
    return <p className="text-sm text-text-dim italic">{r.message || r.note || "No agents matched."}</p>;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-dim">{r.total} agent{r.total !== 1 ? "s" : ""} found</p>
        {r.total > 6 && <Link href="/explore" className="text-xs text-accent hover:underline">View all →</Link>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {r.results.slice(0, 6).map((a: AgentSummary) => <AgentCard key={a.agent_id} agent={a} />)}
      </div>
    </div>
  );
}

function RichPanel({ toolCalls }: { toolCalls: AgentTaskResult["tool_calls_made"] }) {
  // Build name/description lookup from search results
  const searchIndex: Record<number, any> = {};
  for (const c of toolCalls) {
    if (c.tool === "search_agents" && Array.isArray(c.result?.results))
      for (const a of c.result.results) if (a.agent_id != null) searchIndex[a.agent_id] = a;
  }

  const profileIds = new Set(
    toolCalls.filter(c => c.tool === "get_agent_profile" && c.result?.found).map(c => c.result.agent_id)
  );

  const panels: React.ReactNode[] = [];
  const seen = new Set<string>();

  for (const c of toolCalls) {
    const r = c.result;
    if (!r) continue;

    if (c.tool === "get_agent_profile" && r.found) {
      const key = `p-${r.agent_id}`;
      if (seen.has(key)) continue; seen.add(key);
      panels.push(
        <div key={key} className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-dim">{TOOL_LABELS[c.tool]}</p>
          <AgentProfileCard r={r} extra={searchIndex[r.agent_id]} />
        </div>
      );
      continue;
    }

    if ((c.tool === "discover_agents" || c.tool === "search_agents") && Array.isArray(r.results)) {
      if (c.tool === "search_agents" && r.results.every((a: any) => profileIds.has(a.agent_id))) continue;
      const key = `d-${r.results.map((a: any) => a.agent_id).join()}`;
      if (seen.has(key)) continue; seen.add(key);
      panels.push(
        <div key={key} className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-dim">{TOOL_LABELS[c.tool]}</p>
          <DiscoveryCard r={r} />
        </div>
      );
      continue;
    }

    if (c.tool === "create_escrow" || c.tool === "check_escrow_status") {
      panels.push(
        <div key={c.timestamp} className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-dim">{TOOL_LABELS[c.tool]}</p>
          <pre className="rounded-lg border border-border bg-surface p-3 text-xs overflow-x-auto text-text-dim">
            {JSON.stringify(r, null, 2)}
          </pre>
        </div>
      );
    }
  }

  return panels.length > 0 ? <div className="space-y-4">{panels}</div> : null;
}

export function AnswerResult({ result }: { result: AgentTaskResult }) {
    console.log("RESPONSE:", result.response); // add this
  console.log("TOOL_CALLS:", result.tool_calls_made.length);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-8 space-y-4 text-left">
      {/* Final answer — exactly what the backend returned, no filtering */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="whitespace-pre-wrap leading-relaxed">{result.response}</p>
      </div>

      {/* Structured data cards */}
      {result.tool_calls_made.length > 0 && (
        <RichPanel toolCalls={result.tool_calls_made} />
      )}

      {/* Collapsible trace */}
      {result.tool_calls_made.length > 0 && (
        <div className="rounded-lg border border-border bg-surface">
          <button onClick={() => setExpanded(v => !v)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-text-dim">
            <span>
              {result.tool_calls_made.length} check{result.tool_calls_made.length !== 1 ? "s" : ""} · {result.iterations} iteration{result.iterations !== 1 ? "s" : ""} · {result.model}
            </span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <div className="space-y-1.5 border-t border-border px-4 py-3">
              {result.tool_calls_made.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-dim">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                  <span>{TOOL_LABELS[c.tool] || c.tool}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}