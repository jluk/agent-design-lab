function tokenize(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) || [];
}

function countMatches(tokens, candidateTokens) {
  let score = 0;
  for (const token of tokens) {
    if (candidateTokens.includes(token)) {
      score += 1;
    }
  }
  return score;
}

function recencyBoost(timestamp) {
  const ageHours = (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
  return Math.max(0.2, 2 - ageHours / 48);
}

export function retrievePosts(posts, plan, limit = 7) {
  const facetTokens = tokenize(plan.facets.join(" "));

  const scored = posts
    .map((post) => {
      const candidateTokens = tokenize(`${post.content} ${post.tags.join(" ")} ${post.author}`);
      const keywordScore = countMatches(facetTokens, candidateTokens);
      const tagBoost = post.tags.some((tag) => plan.facets.some((facet) => tag.includes(facet))) ? 2 : 0;
      const score = keywordScore + tagBoost + recencyBoost(post.timestamp);

      return {
        ...post,
        retrieval: {
          keywordScore,
          tagBoost,
          recencyBoost: Number(recencyBoost(post.timestamp).toFixed(2)),
          score: Number(score.toFixed(2))
        }
      };
    })
    .filter((post) => post.retrieval.score > 1.5)
    .sort((a, b) => b.retrieval.score - a.retrieval.score)
    .slice(0, limit);

  return scored;
}

export function clusterPosts(posts) {
  const themeLexicon = {
    guardrails: ["guardrail", "policy", "harmony", "tone", "handoff", "compliance", "escalation"],
    observability: ["trace", "debug", "observability", "incident", "review", "why"],
    evaluation: ["eval", "benchmark", "judge", "compare", "failure"],
    hype: ["vc", "funding", "magic", "pitching", "hype", "deck"],
    knowledge: ["rag", "doc", "retrieval", "knowledge", "policy"],
    voice: ["voice", "transcription", "timing", "interrupt", "latency"],
    architecture: ["architecture", "workflow", "prompt", "tool", "router", "flowchart"]
  };

  const clusters = new Map();

  for (const [theme, lexicon] of Object.entries(themeLexicon)) {
    const matches = posts.filter((post) => {
      const haystack = `${post.content} ${post.tags.join(" ")}`.toLowerCase();
      return lexicon.some((needle) => haystack.includes(needle));
    });

    if (matches.length > 0) {
      clusters.set(theme, matches);
    }
  }

  return Array.from(clusters.entries()).map(([theme, members]) => ({
    theme,
    posts: members
  }));
}
