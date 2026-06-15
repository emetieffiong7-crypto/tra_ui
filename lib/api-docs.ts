import { API_BASE_URL } from "./api";
import { Endpoint } from "@/components/endpoint-doc";

export const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/discover",
    title: "Browse agents",
    description:
      "Returns agents ranked by trust score. Filter by capability, minimum score, or Self verification.",
    auth: "None required.",
    example: `GET ${API_BASE_URL}/discover?capability=a2a&min_score=50&limit=5

{
  "results": [
    { "agent_id": 9051, "name": "Celo Intelligence", "trust_score": 37, "self_verified": false }
  ],
  "total": 1
}`,
  },
  {
    method: "GET",
    path: "/discover/search",
    title: "Search agents by name",
    description:
      "Case-insensitive search across agent names and descriptions. Instant — reads straight from TrustGuard's database.",
    auth: "None required.",
    example: `GET ${API_BASE_URL}/discover/search?q=soma

{
  "results": [
    { "agent_id": 9176, "name": "Soma", "trust_score": 15 }
  ],
  "total": 1
}`,
  },
  {
    method: "GET",
    path: "/discover/agent",
    title: "Get a full agent profile",
    description:
      "Pass either agent_id or address. Returns identity, Self verification, reputation, a score breakdown, and a risk-based recommendation.",
    auth: "None required.",
    example: `GET ${API_BASE_URL}/discover/agent?agent_id=9051

{
  "agent_id": 9051,
  "name": "Celo Intelligence",
  "trust_score": 37,
  "risk_level": "MODERATE",
  "score_breakdown": { "age": 10, "card": 17, "reputation": 0, "self": 0, "probe": 10 },
  "recommendation": "PROCEED WITH CAUTION — verify before large payments"
}`,
  },
  {
    method: "GET",
    path: "/discover/activity",
    title: "Recent verification activity",
    description: "A live feed of the endpoint checks TrustGuard has run across the ecosystem.",
    auth: "None required.",
    example: `GET ${API_BASE_URL}/discover/activity?limit=10

{
  "activity": [
    { "agent_id": 9051, "agent_name": "Celo Intelligence", "passed": true, "probed_at": "2026-06-14T20:38:27Z" }
  ],
  "total": 1
}`,
  },
  {
    method: "POST",
    path: "/agent/task",
    title: "Ask a question in plain language",
    description:
      "Send a natural language request. TrustGuard checks reputation, verification, and activity, then replies with a short answer plus the agents it found.",
    auth: "None required for light use. Add x-trustguard-api-key for higher limits and onchain actions.",
    example: `POST ${API_BASE_URL}/agent/task
Content-Type: application/json

{ "task": "find a trustworthy payments agent on Celo", "stream": false }

{
  "response": "...",
  "tool_calls_made": [...],
  "tools_used": ["discover_agents", "get_agent_profile"]
}`,
  },
  {
    method: "POST",
    path: "/agent/a2a",
    title: "Agent-to-agent JSON-RPC",
    description:
      "The same reasoning as /agent/task, in the A2A message format other agents expect. Built for agent-to-agent integrations.",
    auth: "None required for light use. Self Agent ID signatures get higher limits automatically.",
    example: `POST ${API_BASE_URL}/agent/a2a
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": { "message": { "role": "user", "parts": [{ "kind": "text", "text": "check agent 9051" }] } }
}`,
  },
];