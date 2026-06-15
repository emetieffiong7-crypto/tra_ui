export interface AgentSummary {
  agent_id: number;
  name: string | null;
  description?: string | null;
  trust_score: number;
  self_verified: boolean;
  supports_x402: boolean;
  a2a_endpoint: string | null;
  success_rate?: number;
  owner_address?: string;
}

export interface DiscoveryResponse {
  results: AgentSummary[];
  total: number;
  filtered_by_capability: string | null;
  min_score_applied: number;
}

export interface ScoreBreakdown {
  total: number;
  age: number;
  card: number;
  reputation: number;
  self: number;
  probe: number;
}

export interface SelfVerification {
  verified: boolean;
  proof_fresh: boolean;
  proof_expires_at: string | null;
  verification_strength: number | null;
  proof_provider: string | null;
  sybil_count: number | null;
  source: string;
}

export interface AgentProfile {
  agent_id: number;
  owner_address: string;
  wallet_address: string | null;
  card_uri: string | null;
  registered_at: string | null;
  name: string | null;
  description: string | null;
  a2a_endpoint: string | null;
  supports_x402: boolean;
  trust_score: number;
  score_breakdown: ScoreBreakdown;
  risk_level: "LOW" | "MEDIUM" | "MODERATE" | "HIGH" | "BLOCKED" | string;
  is_blacklisted: boolean;
  self_verification: SelfVerification;
  reputation: {
    total_feedback: number;
    cumulative_score: number;
    avg_score: number;
  };
  probe_history: any[];
  trustguard_metadata: {
    last_probed_at: string | null;
    last_scored_at: string | null;
    consecutive_failures: number;
    in_local_db: boolean;
  };
}

export type StreamEvent =
  | { type: "start"; task: string; tools_loaded: string[] }
  | { type: "thinking"; iteration: number; max: number }
  | { type: "tool_call"; tool: string; parameters: Record<string, any> }
  | { type: "tool_result"; tool: string; result: any }
  | { type: "reasoning"; content: string; tokens?: { input: number; output: number } }
  | {
      type: "complete";
      response: string;
      tool_calls_made: any[];
      iterations: number;
      model: string;
      tools_used: string[];
      note?: string;
    }
  | { type: "error"; error: string };

export interface ActivityItem {
  agent_id: number;
  agent_name: string | null;
  trust_score: number | null;
  passed: boolean;
  evidence: string;
  response_time_ms: number | null;
  posted_onchain: boolean;
  tx_hash: string | null;
  probed_at: string | null;
}