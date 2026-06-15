import { AgentProfile, DiscoveryResponse, StreamEvent, ActivityItem } from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!!;
console.log("API_BASE_URL:", API_BASE_URL);

export async function discoverAgents(params: {
  capability?: string;
  minScore?: number;
  selfVerifiedOnly?: boolean;
  limit?: number;
}): Promise<DiscoveryResponse> {
  const search = new URLSearchParams();
  if (params.capability) search.set("capability", params.capability);
  if (params.minScore) search.set("min_score", String(params.minScore));
  if (params.selfVerifiedOnly) search.set("self_verified_only", "true");
  search.set("limit", String(params.limit ?? 12));

  const res = await fetch(`${API_BASE_URL}/discover?${search.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not load agents");
  return res.json();
}

export async function searchAgents(query: string, limit = 12): Promise<DiscoveryResponse> {
  const search = new URLSearchParams({ q: query, limit: String(limit) });
  const res = await fetch(`${API_BASE_URL}/discover/search?${search.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getAgentProfile(idOrAddress: string): Promise<AgentProfile | null> {
  const isAddress = idOrAddress.startsWith("0x");
  const search = new URLSearchParams(
    isAddress ? { address: idOrAddress } : { agent_id: idOrAddress }
  );
  const res = await fetch(`${API_BASE_URL}/discover/agent?${search.toString()}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load agent");
  return res.json();
}
export interface AgentTaskResult {
  response: string;
  tool_calls_made: Array<{
    tool: string;
    parameters: Record<string, any>;
    result: any;
    timestamp: string;
  }>;
  iterations: number;
  model: string;
  tools_used: string[];
}


export async function getRecentActivity(
  limit = 20
): Promise<{ activity: ActivityItem[]; total: number }> {
  const res = await fetch(`${API_BASE_URL}/discover/activity?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not load activity");
  return res.json();
}

export async function runAgentTask(task: string, signal?: AbortSignal): Promise<AgentTaskResult> {
  const res = await fetch(`${API_BASE_URL}/agent/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ task, stream: false }),
    body: JSON.stringify({ task, stream: false, model: "llama-3.3-70b-versatile" }),
    signal,
  });

  const raw = await res.text();
  console.log("RAW RESPONSE:", raw); // add this
  
  if (!res.ok) throw new Error("TrustGuard couldn't process that request.");
  return JSON.parse(raw);
}

export async function registerApiKey(params: {
  label: string;
  email?: string;
  purpose?: string;
}): Promise<{ key: string; label: string; rate_limit: string }> {
  const search = new URLSearchParams();
  search.set("label", params.label);
  if (params.email) search.set("email", params.email);
  if (params.purpose) search.set("purpose", params.purpose);

  const res = await fetch(`${API_BASE_URL}/admin/keys/register?${search.toString()}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Could not create key");
  return res.json();
}

/**
 * Streams TrustGuard's reasoning for a natural language task.
 * Calls onEvent for every step as it arrives.
 */
export async function streamAgentTask(
  task: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/agent/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, stream: true, model: "llama-3.3-70b-versatile" }),
    signal,
  });

  if (!res.body) throw new Error("Streaming is not supported by this response.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";

    for (const chunk of chunks) {
      const line = chunk.trim();
      if (!line.startsWith("data:")) continue;
      const jsonPart = line.slice(5).trim();
      if (!jsonPart) continue;
      try {
        onEvent(JSON.parse(jsonPart) as StreamEvent);
      } catch {
        // ignore malformed chunks
      }
    }
  }
}