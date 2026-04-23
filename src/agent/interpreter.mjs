function unique(items) {
  return Array.from(new Set(items));
}

function inferArchetypes(posts) {
  const archetypeRules = [
    {
      name: "Reliability Realists",
      test: (text) => /debug|trace|incident|retry|stale/i.test(text),
      description: "Engineers who care less about the flashy demo and more about whether the system can be understood and trusted under stress."
    },
    {
      name: "Guardrail Pragmatists",
      test: (text) => /guardrail|handoff|policy|tone|compliance|escalation/i.test(text),
      description: "Operators framing agent quality around constraint handling, tone, and graceful escalation."
    },
    {
      name: "Hype Translators",
      test: (text) => /vc|magic|autonomous|funding|pitch/i.test(text),
      description: "People translating market hype into operational reality, often with a raised eyebrow."
    },
    {
      name: "Eval Maximalists",
      test: (text) => /eval|benchmark|compare|judge|failure/i.test(text),
      description: "Builders insisting that quality claims mean little unless regressions can be measured."
    }
  ];

  return archetypeRules
    .map((rule) => ({
      ...rule,
      matchingPosts: posts.filter((post) => rule.test(post.content))
    }))
    .filter((entry) => entry.matchingPosts.length > 0)
    .slice(0, 3)
    .map((entry) => ({
      name: entry.name,
      description: entry.description,
      evidence: entry.matchingPosts.map((post) => post.id)
    }));
}

function buildThemeLines(clusters) {
  return clusters.slice(0, 3).map((cluster) => {
    const authors = unique(cluster.posts.map((post) => post.author)).slice(0, 2).join(" and ");
    return {
      theme: cluster.theme,
      summary: `The discourse keeps circling ${cluster.theme}, with ${authors} anchoring the conversation in concrete tradeoffs instead of broad optimism.`,
      evidence: cluster.posts.slice(0, 3).map((post) => post.id)
    };
  });
}

export function interpretDiscourse(plan, retrievedPosts, clusters) {
  const archetypes = inferArchetypes(retrievedPosts);
  const notableTakes = buildThemeLines(clusters);
  const topAuthors = unique(retrievedPosts.map((post) => post.author)).slice(0, 3);

  const summary = `For "${plan.topic}", the dominant mood is skeptical optimism: people still believe in agents, but only when the system shows its work, respects constraints, and survives contact with messy reality. The loudest voices are pushing the conversation away from generic autonomy claims and toward retrieval quality, observability, and escalation design.`;

  const humorMode = `If the timeline had to ship this topic by Friday, it would launch an "autonomous" agent that secretly runs on guardrails, traces, and one heroic support lead named Olivia.`;

  const startupPitchParody = `We are building the first vertically integrated vibe infrastructure platform for enterprise discernment. Our moat is tasteful orchestration, benchmark-backed irony, and a handoff button investors can believe in.`;

  return {
    summary,
    keyArchetypes: archetypes,
    notableTakes,
    humorMode,
    startupPitchParody,
    highlightedAuthors: topAuthors
  };
}
