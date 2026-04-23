# Agent Design Lab

Agent Design Lab is a hands-on agent project for exploring multi-step orchestration, grounded retrieval, observability, and evaluation.

It starts from a discourse-analysis spec and turns it into a compact agent workbench you can run, inspect, and extend.

## Why This Project Is Useful

This repo is intentionally built around the parts of agent development that matter in production:

- multi-step orchestration instead of a single prompt
- grounded retrieval over curated knowledge
- explicit trace logging so you can explain what happened
- critic checks for generic or weakly grounded output
- offline evaluations so you can improve the system on purpose

The product is still fun: it turns tech discourse into an "Agent Report" with archetypes, notable takes, and satire. The goal is to make agent behavior inspectable instead of magical.

## What You Can Demo

1. Ask a topic like `AI agents`, `RAG`, or `startup drama`.
2. Watch the system plan, retrieve, cluster, interpret, and critique.
3. Inspect the trace log that shows intermediate decisions.
4. Run offline evals to compare prompt or retrieval changes.

## Project Structure

- [server.mjs](/Users/jluk/Documents/New%20project/server.mjs)
- [src/agent/pipeline.mjs](/Users/jluk/Documents/New%20project/src/agent/pipeline.mjs)
- [src/agent/retrieval.mjs](/Users/jluk/Documents/New%20project/src/agent/retrieval.mjs)
- [src/agent/interpreter.mjs](/Users/jluk/Documents/New%20project/src/agent/interpreter.mjs)
- [src/agent/critic.mjs](/Users/jluk/Documents/New%20project/src/agent/critic.mjs)
- [src/evals/runSuite.mjs](/Users/jluk/Documents/New%20project/src/evals/runSuite.mjs)

## Run It

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Run Evals

```bash
npm run eval
```

## Best Ways To Extend It

- swap the heuristic interpreter with a real LLM call
- replace static curated posts with ingestion from bookmarks or exported lists
- add an experiment runner that compares multiple prompt variants
- add a customer-support discourse mode with richer escalation logic
