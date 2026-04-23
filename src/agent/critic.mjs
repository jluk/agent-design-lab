function collectEvidenceIds(report) {
  const ids = new Set();

  for (const archetype of report.keyArchetypes) {
    for (const id of archetype.evidence) {
      ids.add(id);
    }
  }

  for (const take of report.notableTakes) {
    for (const id of take.evidence) {
      ids.add(id);
    }
  }

  return Array.from(ids);
}

export function critiqueReport(report, retrievedPosts) {
  const evidenceIds = collectEvidenceIds(report);
  const retrievedIds = new Set(retrievedPosts.map((post) => post.id));
  const unsupportedIds = evidenceIds.filter((id) => !retrievedIds.has(id));
  const genericPhrases = ["things are changing", "a lot of discussion", "many people", "it depends"];
  const genericHits = genericPhrases.filter((phrase) => report.summary.includes(phrase));

  const coverageRatio = evidenceIds.length / Math.max(1, retrievedPosts.length);

  return {
    grounded: unsupportedIds.length === 0,
    unsupportedIds,
    genericHits,
    coverageRatio: Number(coverageRatio.toFixed(2)),
    passes:
      unsupportedIds.length === 0 &&
      genericHits.length === 0 &&
      coverageRatio >= 0.4,
    notes: [
      unsupportedIds.length === 0
        ? "All cited evidence maps to retrieved posts."
        : `Unsupported citations detected: ${unsupportedIds.join(", ")}.`,
      genericHits.length === 0
        ? "The summary avoids the genericity phrases checked by the critic."
        : `Generic phrasing detected: ${genericHits.join(", ")}.`,
      coverageRatio >= 0.4
        ? "The report uses a healthy slice of retrieved evidence."
        : "The report is too narrow relative to retrieved evidence."
    ]
  };
}
