# Roadmap

This file is the clean handoff list for future work on Agent Design Lab.

## Highest-Leverage Next Steps

### 1. Add Real Model Integration

Goal:
Replace the current heuristic planner, interpreter, and critic with a model-backed implementation behind a small provider interface.

Why it matters:
This is the biggest jump in realism and makes the project more useful as an actual agent-design sandbox.

Suggested deliverables:

- `src/llm/` provider abstraction
- environment-variable based model configuration
- prompt templates separated from orchestration logic
- fallback mode so the app still works without API keys

### 2. Add Better Ingestion

Goal:
Move beyond the static local dataset.

Why it matters:
Right now the app demonstrates orchestration well, but not ingestion or freshness.

Suggested deliverables:

- CSV import path
- bookmarks import path
- normalized ingestion pipeline into the existing schema
- deduplication pass for repeated entries

### 3. Improve Evaluation

Goal:
Turn evals from a lightweight smoke test into a more meaningful regression harness.

Why it matters:
The project already has the right shape for eval-driven improvement. It just needs deeper metrics.

Suggested deliverables:

- per-stage failure annotations
- groundedness checks tied to evidence ids
- output specificity checks
- snapshot comparison for regression testing
- optional LLM-as-judge mode behind a provider flag

### 4. Add Persistence

Goal:
Store runs, traces, and eval results.

Why it matters:
Persistent history makes experimentation and demos much more credible.

Suggested deliverables:

- SQLite database for runs and evals
- saved run browser in the UI
- compare-two-runs view

### 5. Deploy Publicly

Goal:
Host the app on a public subdomain such as `lab.jluk.me`.

Why it matters:
Public hosting makes the project shareable and turns it into a stronger portfolio artifact.

Suggested deliverables:

- choose a hosting target such as Railway, Render, Fly.io, or a VPS
- configure environment variables
- set up custom domain routing
- add a simple production deployment guide

## Good GitHub Issue Titles

- Add model provider abstraction and prompt templates
- Import discourse data from CSV or bookmarks
- Expand eval suite with groundedness and specificity checks
- Persist runs and traces with SQLite
- Deploy Agent Design Lab to `lab.jluk.me`
