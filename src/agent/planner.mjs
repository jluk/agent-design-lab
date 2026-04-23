const queryExpansions = {
  "ai agents": ["guardrails", "observability", "handoff", "architecture", "evals"],
  rag: ["knowledge", "staleness", "retrieval", "docs", "evals"],
  "startup drama": ["hype", "vc", "enterprise", "satire", "narratives"],
  voice: ["timing", "interruptions", "recovery", "latency"]
};

export function planQuery(topic) {
  const normalized = topic.trim().toLowerCase();
  const expansions = queryExpansions[normalized] || normalized.split(/\s+/);

  const facets = Array.from(
    new Set(
      [normalized, ...expansions].flatMap((value) => value.split(/\s+/)).filter(Boolean)
    )
  );

  return {
    topic,
    facets,
    objective:
      "Produce a grounded agent report that identifies themes, tensions, and archetypes without drifting into unsupported claims.",
    successCriteria: [
      "Use retrieved evidence, not generic observations.",
      "Capture at least two distinct tensions in the discourse.",
      "Keep satire derivative of source material."
    ]
  };
}
