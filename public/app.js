const reportContent = document.querySelector("#report-content");
const traceContent = document.querySelector("#trace-content");
const postsContent = document.querySelector("#posts-content");
const evalContent = document.querySelector("#eval-content");
const criticPill = document.querySelector("#critic-pill");
const topicInput = document.querySelector("#topic-input");
const queryForm = document.querySelector("#query-form");
const evalButton = document.querySelector("#eval-button");
const flowSteps = [...document.querySelectorAll(".flow-step")];
const stageTitle = document.querySelector("#stage-title");
const stageDescription = document.querySelector("#stage-description");
const stageMetrics = document.querySelector("#stage-metrics");
const stageWhyCopy = document.querySelector("#stage-why-copy");
const stageRiskCopy = document.querySelector("#stage-risk-copy");
const stageTraceCopy = document.querySelector("#stage-trace-copy");
const impactGrid = document.querySelector("#impact-grid");
const simulatorChecks = [...document.querySelectorAll("#sim-toggle-grid input[type='checkbox']")];
const simResetButton = document.querySelector("#sim-reset-button");
const simScenarioTitle = document.querySelector("#sim-scenario-title");
const simScenarioSummary = document.querySelector("#sim-scenario-summary");
const simMetricGrid = document.querySelector("#sim-metric-grid");
const simEvidenceSummary = document.querySelector("#sim-evidence-summary");
const simReportSummary = document.querySelector("#sim-report-summary");
const simConsequences = document.querySelector("#sim-consequences");

const stageGuide = {
  input: {
    title: "Topic Input sets the search direction",
    description:
      "A narrow query produces a focused report. A fuzzy query makes the rest of the pipeline work harder because every downstream stage inherits the ambiguity.",
    why: "This stage defines scope. Better inputs usually improve theme coverage and reduce generic summaries before any reasoning even starts.",
    risk: "If the topic is vague, retrieval drifts, clustering gets noisy, and the final report can feel hand-wavy.",
    traceKey: "planner",
    metrics: [
      { label: "Theme coverage", value: 68 },
      { label: "Specificity", value: 62 },
      { label: "Critic pass rate", value: 38 }
    ],
    impacts: [
      { title: "What it controls", body: "It determines the initial semantic target for the planner and influences how many useful facets the system can discover." },
      { title: "Best mental model", body: "Think of it as setting the hypothesis for the run. Everything else is a refinement of this input." },
      { title: "Score signal", body: "Strong input usually raises theme hits first because the rest of the system starts from a cleaner search space." },
      { title: "Failure pattern", body: "Broad prompts tend to produce reports that sound polished but cover fewer concrete subthemes." }
    ]
  },
  planner: {
    title: "Planner improves retrieval quality before search begins",
    description:
      "The planner expands the query into facets and success criteria so retrieval is not limited to exact keyword overlap.",
    why: "This stage helps the retriever look for adjacent concepts, which makes the system more robust to wording differences in the source data.",
    risk: "Weak planning narrows the search too aggressively, which lowers coverage and can miss the posts your eval set expects.",
    traceKey: "planner",
    metrics: [
      { label: "Theme coverage", value: 84 },
      { label: "Retrieval recall", value: 80 },
      { label: "Specificity", value: 58 }
    ],
    impacts: [
      { title: "What it improves", body: "Facet expansion makes it easier to retrieve evidence tied to related ideas like guardrails, evals, or handoff design." },
      { title: "Eval connection", body: "This stage mostly affects required post hits and theme hits because it broadens the candidate set intelligently." },
      { title: "Why not skip it", body: "Without planning, the app behaves more like a plain keyword matcher than an agentic analysis pipeline." },
      { title: "Common tradeoff", body: "Too much expansion can introduce noise, so planning is a recall vs precision lever." }
    ]
  },
  retrieval: {
    title: "Retriever anchors the report in evidence",
    description:
      "The retriever ranks posts using keyword overlap, tag matching, and recency so the rest of the system works from concrete inputs.",
    why: "This is the grounding layer. If retrieval is good, interpretation can be bold without becoming detached from the source material.",
    risk: "Weak retrieval damages nearly every score. Missing source posts lowers required hits, reduces theme coverage, and makes critic checks less meaningful.",
    traceKey: "retrieval",
    metrics: [
      { label: "Required post hits", value: 92 },
      { label: "Groundedness", value: 88 },
      { label: "Theme coverage", value: 76 }
    ],
    impacts: [
      { title: "What it improves", body: "Better retrieval gives the interpreter a richer and more trustworthy set of examples to synthesize." },
      { title: "Eval connection", body: "This stage has the strongest effect on required hits because the eval suite explicitly checks whether key evidence was found." },
      { title: "Debug signal", body: "If a report feels wrong, the first question is often whether the right posts were retrieved at all." },
      { title: "Tradeoff", body: "Favoring recency too much can crowd out older but highly relevant posts; favoring keyword only can miss semantic matches." }
    ]
  },
  clustering: {
    title: "Clustering turns a pile of posts into structure",
    description:
      "This stage groups retrieved evidence into themes so the system can reason about patterns instead of isolated examples.",
    why: "Clustering creates the bridge between retrieval and interpretation. It helps the report talk about tensions and recurring narratives rather than list fragments.",
    risk: "Weak clustering makes the report repetitive or disconnected because the interpreter has no clear structure to build on.",
    traceKey: "clustering",
    metrics: [
      { label: "Specificity", value: 72 },
      { label: "Theme coverage", value: 78 },
      { label: "Narrative coherence", value: 82 }
    ],
    impacts: [
      { title: "What it improves", body: "It helps the report identify major themes like observability or guardrails instead of speaking in generalities." },
      { title: "Eval connection", body: "Better clustering tends to lift theme hits because the report is more likely to mention the intended concepts." },
      { title: "Learning value", body: "This stage is a great place to compare heuristics, embeddings, or topic models without rewriting the whole system." },
      { title: "Failure pattern", body: "Bad clusters create duplicated ideas across sections and make archetypes feel arbitrary." }
    ]
  },
  interpreter: {
    title: "Interpreter converts evidence into a product experience",
    description:
      "This is where the system produces summaries, archetypes, notable takes, and satire while trying to stay faithful to the retrieved evidence.",
    why: "Interpretation is the user-facing layer. It decides whether the system feels insightful, bland, or overconfident.",
    risk: "If the interpreter is too generic, the report sounds polished but weak. If it is too aggressive, it can outrun the evidence and fail the critic.",
    traceKey: "interpreter",
    metrics: [
      { label: "Specificity", value: 86 },
      { label: "Clarity", value: 84 },
      { label: "Groundedness", value: 63 }
    ],
    impacts: [
      { title: "What it improves", body: "This stage shapes the quality of the final explanation, including whether the app feels interesting enough to use." },
      { title: "Eval connection", body: "It has a large effect on theme hits and critic pass because wording choices determine whether the output stays concrete." },
      { title: "Why it matters", body: "Users judge the product here, even though upstream system quality determines how much freedom the interpreter actually has." },
      { title: "Tradeoff", body: "Richer interpretation increases insight, but it also increases the risk of drifting beyond what the evidence supports." }
    ]
  },
  critic: {
    title: "Critic closes the loop before you trust the answer",
    description:
      "The critic checks grounding, generic phrasing, and evidence coverage so the system can catch weak outputs instead of only presenting them confidently.",
    why: "This stage acts like a lightweight quality gate. It does not fix the report, but it tells you when the pipeline probably underperformed.",
    risk: "Without a critic, weak runs look deceptively complete. You lose visibility into whether the report was grounded or simply persuasive.",
    traceKey: "critic",
    metrics: [
      { label: "Critic pass rate", value: 94 },
      { label: "Groundedness", value: 88 },
      { label: "Safety against generic output", value: 90 }
    ],
    impacts: [
      { title: "What it improves", body: "It surfaces unsupported evidence, generic phrases, and low coverage before the user assumes the answer is reliable." },
      { title: "Eval connection", body: "The eval suite gives this stage direct weight through the critic pass component in the final score." },
      { title: "Best mental model", body: "This is observability plus guardrails, not magic. It helps you diagnose quality rather than replacing upstream reasoning." },
      { title: "Failure pattern", body: "If the critic is too lax, regressions slip through. If it is too strict, good outputs get flagged and iteration slows down." }
    ]
  }
};

const simulatorGuide = {
  planner: {
    label: "Planner",
    penalties: { themeCoverage: 18, specificity: 8, overall: 10, evidenceCount: 1, clusterCount: 1 },
    reportEffects: [
      "The report will cover fewer adjacent ideas because the search space narrows early.",
      "Expected theme hits drop first because the retriever sees fewer useful facets."
    ],
    symptoms: [
      { title: "Narrow retrieval surface", body: "The run becomes more dependent on exact wording, so the system misses related posts that use different language." },
      { title: "Less resilient topic coverage", body: "The report may sound focused, but it will likely skip important subthemes like handoff, evals, or observability." }
    ]
  },
  retrieval: {
    label: "Retrieval",
    penalties: { themeCoverage: 24, groundedness: 26, specificity: 10, overall: 18, evidenceCount: 3, clusterCount: 1 },
    reportEffects: [
      "The report becomes less anchored because the evidence pool is thinner.",
      "Groundedness drops sharply when the retriever misses representative posts."
    ],
    symptoms: [
      { title: "Evidence quality collapses", body: "The interpreter has fewer strong examples, so every downstream step becomes less trustworthy." },
      { title: "Eval misses increase", body: "Required post hits are the first thing to break because the eval suite directly checks whether critical evidence was found." }
    ]
  },
  clustering: {
    label: "Clustering",
    penalties: { themeCoverage: 12, groundedness: 4, specificity: 18, overall: 10, evidenceCount: 0, clusterCount: 2 },
    reportEffects: [
      "The output feels more list-like and less pattern-oriented.",
      "Specificity falls because the report has trouble organizing evidence into reusable themes."
    ],
    symptoms: [
      { title: "Themes get noisy", body: "Related posts no longer reinforce each other cleanly, which makes the report feel fragmented." },
      { title: "Archetypes feel arbitrary", body: "Without clean theme groupings, the interpreter has weaker structure to build meaningful categories from." }
    ]
  },
  interpreter: {
    label: "Interpreter",
    penalties: { themeCoverage: 8, groundedness: 10, specificity: 24, overall: 16, evidenceCount: 0, clusterCount: 0 },
    reportEffects: [
      "The final explanation becomes more generic even if the evidence underneath is still decent.",
      "This is the fastest way to make the app feel less insightful without changing retrieval itself."
    ],
    symptoms: [
      { title: "Bland output", body: "The report starts sounding safe and polished instead of precise and memorable." },
      { title: "Evidence is underused", body: "Good posts may still be retrieved, but the output fails to translate them into strong observations." }
    ]
  },
  critic: {
    label: "Critic",
    penalties: { themeCoverage: 2, groundedness: 8, specificity: 6, overall: 12, evidenceCount: 0, clusterCount: 0, criticSafety: 42 },
    reportEffects: [
      "Weak runs are less likely to be flagged before the user reads them.",
      "The visible answer looks more confident even though the quality gate is weaker."
    ],
    symptoms: [
      { title: "Regression detection weakens", body: "The system loses its best built-in warning signal for unsupported or overly generic outputs." },
      { title: "Confidence outpaces quality", body: "Users see a complete answer, but the app provides less help distinguishing strong runs from weak ones." }
    ]
  }
};

let activeStageId = "input";
let currentRunData = null;

function renderReport(report) {
  return `
    <section class="report-block report-card">
      <p class="metric-label">Summary</p>
      <p>${report.summary}</p>
    </section>
    <section class="report-block report-card">
      <p class="metric-label">Archetypes</p>
      <ul>
        ${report.keyArchetypes
          .map(
            (item) =>
              `<li><strong>${item.name}.</strong> ${item.description} <span class="meta">evidence: ${item.evidence.join(", ")}</span></li>`
          )
          .join("")}
      </ul>
    </section>
    <section class="report-block report-card">
      <p class="metric-label">Notable Takes</p>
      <ul>
        ${report.notableTakes
          .map(
            (item) =>
              `<li><strong>${item.theme}.</strong> ${item.summary} <span class="meta">evidence: ${item.evidence.join(", ")}</span></li>`
          )
          .join("")}
      </ul>
    </section>
    <section class="report-block report-card split-card">
      <div>
        <p class="metric-label">Humor Mode</p>
        <p>${report.humorMode}</p>
      </div>
      <div>
        <p class="metric-label">Pitch Parody</p>
        <p>${report.startupPitchParody}</p>
      </div>
    </section>
  `;
}

function tracePreview(payload) {
  if (payload.resultCount) {
    return `${payload.resultCount} retrieved items`; 
  }
  if (payload.clusters) {
    return `${payload.clusters.length} clusters formed`;
  }
  if (payload.notes) {
    return payload.notes[0];
  }
  if (payload.objective) {
    return payload.objective;
  }
  if (payload.summary) {
    return payload.summary;
  }
  return "Expand to inspect payload";
}

function renderTrace(trace) {
  const highlightedStage = stageGuide[activeStageId]?.traceKey;

  return trace
    .map((stage) => {
      const isHighlighted = stage.name === highlightedStage;
      const openAttr = isHighlighted ? "open" : "";
      return `
        <details class="trace-item ${isHighlighted ? "is-highlighted" : ""}" ${openAttr}>
          <summary class="trace-summary">
            <div>
              <h3>${stage.name}</h3>
              <p>${tracePreview(stage.payload)}</p>
            </div>
            <code>${stage.timestamp}</code>
          </summary>
          <pre>${JSON.stringify(stage.payload, null, 2)}</pre>
        </details>
      `;
    })
    .join("");
}

function renderPosts(posts) {
  return posts
    .map(
      (post) => `
        <article class="post-card source-card">
          <p><strong>${post.author}</strong> <span class="meta">${post.id} · score ${post.retrieval.score}</span></p>
          <blockquote>${post.content}</blockquote>
          <p class="meta">${post.tags.join(" · ")}</p>
        </article>
      `
    )
    .join("");
}

function renderEvals(result) {
  return `
    <article class="eval-card spotlight-card">
      <p class="metric-label">Average suite score</p>
      <p class="eval-total">${result.averageScore}</p>
    </article>
    ${result.results
      .map(
        (entry) => `
          <article class="eval-card">
            <p><strong>${entry.topic}</strong></p>
            <p>required hits: ${entry.requiredHits}/${entry.requiredTotal}</p>
            <p>theme hits: ${entry.themeHits}/${entry.themeTotal}</p>
            <p>critic pass: ${entry.criticPass ? "yes" : "no"}</p>
            <p><span class="meta">score ${entry.score}</span></p>
          </article>
        `
      )
      .join("")}
  `;
}

function renderStageDetails() {
  const stage = stageGuide[activeStageId];
  stageTitle.textContent = stage.title;
  stageDescription.textContent = stage.description;
  stageWhyCopy.textContent = stage.why;
  stageRiskCopy.textContent = stage.risk;

  const traceMatch = currentRunData?.trace?.find((entry) => entry.name === stage.traceKey);
  stageTraceCopy.textContent = traceMatch
    ? `The current run contains a ${stage.traceKey} trace event, so you can compare this explanation to the live payload shown in the Trace panel.`
    : `This stage maps to the ${stage.traceKey} trace event when the pipeline runs.`;

  stageMetrics.innerHTML = stage.metrics
    .map(
      (metric) => `
        <div class="metric-row">
          <div class="metric-row-head">
            <span>${metric.label}</span>
            <span>${metric.value}%</span>
          </div>
          <div class="metric-bar">
            <div class="metric-bar-fill" style="width: ${metric.value}%"></div>
          </div>
        </div>
      `
    )
    .join("");

  impactGrid.innerHTML = stage.impacts
    .map(
      (impact) => `
        <article class="why-card">
          <h3>${impact.title}</h3>
          <p>${impact.body}</p>
        </article>
      `
    )
    .join("");

  for (const step of flowSteps) {
    step.classList.toggle("is-active", step.dataset.stage === activeStageId);
  }

  if (currentRunData) {
    traceContent.innerHTML = renderTrace(currentRunData.trace);
  }
}

function activeWeakStages() {
  return simulatorChecks.filter((input) => input.checked).map((input) => input.value);
}

function computeBaseMetrics(data) {
  const themeCoverage = Math.min(100, 38 + data.clusters.length * 14 + data.retrievedPosts.length * 2);
  const groundedness = data.critic.grounded
    ? Math.min(96, 74 + Math.round(data.critic.coverageRatio * 20))
    : 46;
  const specificity = Math.min(
    95,
    48 + data.report.notableTakes.length * 11 + data.report.keyArchetypes.length * 7
  );
  const criticSafety = data.critic.passes ? 92 : 54;

  const overall = Math.round(
    themeCoverage * 0.3 + groundedness * 0.3 + specificity * 0.25 + criticSafety * 0.15
  );

  return {
    themeCoverage,
    groundedness,
    specificity,
    criticSafety,
    overall,
    evidenceCount: data.retrievedPosts.length,
    clusterCount: data.clusters.length
  };
}

function simulateMetrics(base, weakStages) {
  const simulated = { ...base };
  const effects = [];
  const symptoms = [];

  for (const stageId of weakStages) {
    const config = simulatorGuide[stageId];
    if (!config) continue;

    effects.push(...config.reportEffects);
    symptoms.push(...config.symptoms);

    for (const [metric, penalty] of Object.entries(config.penalties)) {
      if (metric === "evidenceCount" || metric === "clusterCount") {
        simulated[metric] = Math.max(1, simulated[metric] - penalty);
      } else {
        simulated[metric] = Math.max(8, simulated[metric] - penalty);
      }
    }
  }

  simulated.overall = Math.round(
    simulated.themeCoverage * 0.3 +
      simulated.groundedness * 0.3 +
      simulated.specificity * 0.25 +
      simulated.criticSafety * 0.15
  );

  return {
    simulated,
    effects: Array.from(new Set(effects)),
    symptoms
  };
}

function metricLabel(metric) {
  return {
    themeCoverage: "Theme coverage",
    groundedness: "Groundedness",
    specificity: "Specificity",
    criticSafety: "Critic safety",
    overall: "Overall score"
  }[metric];
}

function renderMetricComparison(base, simulated) {
  const metricKeys = ["themeCoverage", "groundedness", "specificity", "criticSafety", "overall"];

  return metricKeys
    .map((metric) => {
      const delta = simulated[metric] - base[metric];
      const deltaLabel = delta === 0 ? "0" : `${delta > 0 ? "+" : ""}${delta}`;
      const deltaClass = delta < 0 ? "negative" : delta > 0 ? "positive" : "neutral";

      return `
        <article class="metric-card sim-metric-card">
          <p class="metric-label">${metricLabel(metric)}</p>
          <div class="sim-metric-head">
            <strong>${simulated[metric]}%</strong>
            <span class="sim-delta ${deltaClass}">${deltaLabel}</span>
          </div>
          <div class="metric-bar">
            <div class="metric-bar-fill" style="width: ${simulated[metric]}%"></div>
          </div>
          <p class="sim-baseline">Baseline ${base[metric]}%</p>
        </article>
      `;
    })
    .join("");
}

function renderSimulator() {
  if (!currentRunData) {
    simScenarioTitle.textContent = "Healthy pipeline";
    simScenarioSummary.textContent = "Run the agent once to activate the simulator.";
    simMetricGrid.innerHTML = "";
    simEvidenceSummary.innerHTML = "<p>Waiting for a run.</p>";
    simReportSummary.innerHTML = "<p>Waiting for a run.</p>";
    simConsequences.innerHTML = "";
    return;
  }

  const weakStages = activeWeakStages();
  const base = computeBaseMetrics(currentRunData);
  const { simulated, effects, symptoms } = simulateMetrics(base, weakStages);

  if (weakStages.length === 0) {
    simScenarioTitle.textContent = "Healthy pipeline";
    simScenarioSummary.textContent =
      "No weak stages are enabled. This simulator view reflects the current run as-is.";
  } else {
    const labels = weakStages.map((stageId) => simulatorGuide[stageId].label);
    simScenarioTitle.textContent = `Simulated weak points: ${labels.join(" + ")}`;
    simScenarioSummary.textContent =
      "The simulator predicts how this run would degrade if the selected components underperformed. It is a learning tool, not a second real execution.";
  }

  simMetricGrid.innerHTML = renderMetricComparison(base, simulated);

  simEvidenceSummary.innerHTML = `
    <p><strong>Retrieved evidence:</strong> ${simulated.evidenceCount} posts</p>
    <p><strong>Theme groups:</strong> ${simulated.clusterCount} clusters</p>
    <p><strong>Interpretation:</strong> ${weakStages.length === 0 ? "The current run is using the full pipeline." : "The run would likely rely on thinner evidence or weaker structure."}</p>
  `;

  simReportSummary.innerHTML = effects.length
    ? `<ul class="sim-list">${effects.map((effect) => `<li>${effect}</li>`).join("")}</ul>`
    : "<p>No simulated degradation is active.</p>";

  simConsequences.innerHTML = symptoms.length
    ? symptoms
        .map(
          (symptom) => `
            <article class="why-card">
              <h3>${symptom.title}</h3>
              <p>${symptom.body}</p>
            </article>
          `
        )
        .join("")
    : `
      <article class="why-card">
        <h3>Stable baseline</h3>
        <p>The current run keeps the planner, retriever, clustering, interpreter, and critic all healthy, so the simulator shows no predicted failure modes.</p>
      </article>
    `;
}

async function loadReport(topic) {
  criticPill.textContent = "Running";
  criticPill.className = "pill";
  reportContent.innerHTML = "<p>Analyzing discourse...</p>";
  traceContent.innerHTML = "<p>Building trace...</p>";
  postsContent.innerHTML = "<p>Retrieving evidence...</p>";

  const response = await fetch(`/api/report?topic=${encodeURIComponent(topic)}`);
  const data = await response.json();
  currentRunData = data;

  reportContent.innerHTML = renderReport(data.report);
  traceContent.innerHTML = renderTrace(data.trace);
  postsContent.innerHTML = renderPosts(data.retrievedPosts);
  criticPill.textContent = data.critic.passes ? "Critic Pass" : "Critic Warn";
  criticPill.className = `pill ${data.critic.passes ? "pass" : "warn"}`;
  renderStageDetails();
  renderSimulator();
}

async function loadEvals() {
  evalContent.innerHTML = "<p>Running eval suite...</p>";
  const response = await fetch("/api/evals");
  const data = await response.json();
  evalContent.innerHTML = renderEvals(data);
}

queryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadReport(topicInput.value);
});

for (const button of document.querySelectorAll("[data-topic]")) {
  button.addEventListener("click", async () => {
    topicInput.value = button.dataset.topic;
    await loadReport(button.dataset.topic);
  });
}

for (const step of flowSteps) {
  step.addEventListener("click", () => {
    activeStageId = step.dataset.stage;
    renderStageDetails();
  });
}

for (const input of simulatorChecks) {
  input.addEventListener("change", renderSimulator);
}

simResetButton.addEventListener("click", () => {
  for (const input of simulatorChecks) {
    input.checked = false;
  }
  renderSimulator();
});

evalButton.addEventListener("click", loadEvals);

renderStageDetails();
renderSimulator();
await loadReport(topicInput.value);
