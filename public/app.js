const reportContent = document.querySelector("#report-content");
const traceContent = document.querySelector("#trace-content");
const postsContent = document.querySelector("#posts-content");
const evalContent = document.querySelector("#eval-content");
const criticPill = document.querySelector("#critic-pill");
const topicInput = document.querySelector("#topic-input");
const queryForm = document.querySelector("#query-form");
const evalButton = document.querySelector("#eval-button");

function renderReport(report) {
  return `
    <section class="report-block">
      <h3>Summary</h3>
      <p>${report.summary}</p>
    </section>
    <section class="report-block">
      <h3>Archetypes</h3>
      <ul>
        ${report.keyArchetypes
          .map(
            (item) =>
              `<li><strong>${item.name}.</strong> ${item.description} <span class="meta">evidence: ${item.evidence.join(", ")}</span></li>`
          )
          .join("")}
      </ul>
    </section>
    <section class="report-block">
      <h3>Notable Takes</h3>
      <ul>
        ${report.notableTakes
          .map(
            (item) =>
              `<li><strong>${item.theme}.</strong> ${item.summary} <span class="meta">evidence: ${item.evidence.join(", ")}</span></li>`
          )
          .join("")}
      </ul>
    </section>
    <section class="report-block">
      <h3>Humor Mode</h3>
      <p>${report.humorMode}</p>
    </section>
    <section class="report-block">
      <h3>Pitch Parody</h3>
      <p>${report.startupPitchParody}</p>
    </section>
  `;
}

function renderTrace(trace) {
  return trace
    .map(
      (stage) => `
        <article class="trace-item">
          <h3>${stage.name}</h3>
          <p><code>${stage.timestamp}</code></p>
          <pre>${JSON.stringify(stage.payload, null, 2)}</pre>
        </article>
      `
    )
    .join("");
}

function renderPosts(posts) {
  return posts
    .map(
      (post) => `
        <article class="post-card">
          <p><strong>${post.author}</strong> <span class="meta">${post.id} · score ${post.retrieval.score}</span></p>
          <p>${post.content}</p>
          <p class="meta">${post.tags.join(" · ")}</p>
        </article>
      `
    )
    .join("");
}

function renderEvals(result) {
  return `
    <article class="eval-card">
      <p><strong>Average score:</strong> ${result.averageScore}</p>
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

async function loadReport(topic) {
  criticPill.textContent = "Running";
  criticPill.className = "pill";
  reportContent.innerHTML = "<p>Analyzing discourse...</p>";
  traceContent.innerHTML = "<p>Building trace...</p>";
  postsContent.innerHTML = "<p>Retrieving evidence...</p>";

  const response = await fetch(`/api/report?topic=${encodeURIComponent(topic)}`);
  const data = await response.json();

  reportContent.innerHTML = renderReport(data.report);
  traceContent.innerHTML = renderTrace(data.trace);
  postsContent.innerHTML = renderPosts(data.retrievedPosts);
  criticPill.textContent = data.critic.passes ? "Critic Pass" : "Critic Warn";
  criticPill.className = `pill ${data.critic.passes ? "pass" : "warn"}`;
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

evalButton.addEventListener("click", loadEvals);

await loadReport(topicInput.value);
