import { loadEvalCases } from "../agent/data.mjs";
import { runAgentDesignPipeline } from "../agent/pipeline.mjs";

function containsThemeWord(report, expectedThemes) {
  const haystack = JSON.stringify(report).toLowerCase();
  return expectedThemes.filter((theme) => haystack.includes(theme.toLowerCase())).length;
}

export async function runEvalSuite() {
  const cases = await loadEvalCases();
  const results = [];

  for (const evalCase of cases) {
    const output = await runAgentDesignPipeline(evalCase.topic);
    const retrievedIds = new Set(output.retrievedPosts.map((post) => post.id));
    const requiredHits = evalCase.requiredPostIds.filter((id) => retrievedIds.has(id)).length;
    const themeHits = containsThemeWord(output.report, evalCase.expectedThemes);
    const score =
      requiredHits / evalCase.requiredPostIds.length * 0.5 +
      themeHits / evalCase.expectedThemes.length * 0.3 +
      (output.critic.passes ? 0.2 : 0);

    results.push({
      id: evalCase.id,
      topic: evalCase.topic,
      requiredHits,
      requiredTotal: evalCase.requiredPostIds.length,
      themeHits,
      themeTotal: evalCase.expectedThemes.length,
      criticPass: output.critic.passes,
      score: Number(score.toFixed(2))
    });
  }

  const averageScore =
    results.reduce((sum, result) => sum + result.score, 0) / Math.max(1, results.length);

  return {
    averageScore: Number(averageScore.toFixed(2)),
    results
  };
}
