"use client";

import { useState } from "react";
import { ChevronDownIcon } from "./icons";

export interface Endpoint {
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  auth: string;
  example: string;
}

const METHOD_STYLES: Record<string, string> = {
  GET: "text-low border-low/30 bg-low/10",
  POST: "text-accent border-accent/30 bg-accent/10",
};

export function EndpointDoc({ endpoint }: { endpoint: Endpoint }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-surface">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`shrink-0 rounded border px-2 py-0.5 font-mono text-xs font-medium ${METHOD_STYLES[endpoint.method]}`}
          >
            {endpoint.method}
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm">{endpoint.path}</p>
            <p className="text-xs text-text-dim">{endpoint.title}</p>
          </div>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-border px-4 py-3">
          <p className="text-sm text-text-dim">{endpoint.description}</p>
          <p className="text-xs text-text-dim">
            Authentication: <span className="text-text">{endpoint.auth}</span>
          </p>
          <pre className="overflow-x-auto rounded-md bg-surface-2 p-3 text-xs">{endpoint.example}</pre>
        </div>
      )}
    </div>
  );
}