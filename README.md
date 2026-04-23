# Agent Design Lab

Agent Design Lab is a hands-on agent project for exploring multi-step orchestration, grounded retrieval, observability, and evaluation.

It turns a discourse-analysis concept into a compact agent workbench you can run, inspect, and extend.

## What It Does

The app takes a topic like `AI agents`, `RAG`, or `startup drama` and runs it through a visible pipeline:

- topic input
- planner
- retriever
- clustering
- interpreter
- critic

The result is an `Agent Report` backed by retrieved posts, a live trace view, and an offline eval suite.

## Why This Project Is Useful

This repo is intentionally built around the parts of agent development that matter in production:

- multi-step orchestration instead of a single prompt
- grounded retrieval over curated knowledge
- explicit trace logging so you can explain what happened
- critic checks for generic or weakly grounded output
- offline evaluations so you can improve the system on purpose

The goal is to make agent behavior inspectable instead of magical.

## What You Can Demo

1. Ask a topic like `AI agents`, `RAG`, or `startup drama`.
2. Watch the system plan, retrieve, cluster, interpret, and critique.
3. Click through the interactive system map to learn how each stage affects output quality.
4. Inspect the trace log that shows intermediate decisions.
5. Run offline evals to compare prompt or retrieval changes.

## Project Structure

- [server.mjs](/Users/jluk/Documents/agent-design-lab/server.mjs)
- [public/index.html](/Users/jluk/Documents/agent-design-lab/public/index.html)
- [public/app.js](/Users/jluk/Documents/agent-design-lab/public/app.js)
- [public/styles.css](/Users/jluk/Documents/agent-design-lab/public/styles.css)
- [src/agent/pipeline.mjs](/Users/jluk/Documents/agent-design-lab/src/agent/pipeline.mjs)
- [src/agent/retrieval.mjs](/Users/jluk/Documents/agent-design-lab/src/agent/retrieval.mjs)
- [src/agent/interpreter.mjs](/Users/jluk/Documents/agent-design-lab/src/agent/interpreter.mjs)
- [src/agent/critic.mjs](/Users/jluk/Documents/agent-design-lab/src/agent/critic.mjs)
- [src/evals/runSuite.mjs](/Users/jluk/Documents/agent-design-lab/src/evals/runSuite.mjs)
- [docs/ROADMAP.md](/Users/jluk/Documents/agent-design-lab/docs/ROADMAP.md)

## Run It

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Run Evals

```bash
npm run eval
```

## Current Status

Working now:

- local Node server
- curated local dataset
- multi-stage agent pipeline
- trace view
- interactive system map
- offline eval harness

Still intentionally simple:

- no live external ingestion
- no real LLM provider wired in
- no persistent database
- no experiment tracking backend
- no hosted deployment setup yet

## Roadmap

Short-term next steps:

- wire in a real LLM adapter for planner, interpreter, and critic stages
- add a dataset ingestion path from CSV, bookmarks, or saved links
- add experiment presets so prompts and retrieval strategies can be compared
- expand eval metrics beyond required hits and theme hits
- make the trace panel easier to scan with collapsible stages

Good portfolio upgrades:

- add a simulation mode that shows score degradation when a stage is weakened
- support multiple output styles such as analyst, comedian, and skeptic
- add persistent run history with a lightweight SQLite store
- add deployment configuration for a public subdomain

## Next Session Handoff

If we pick this up again, the highest-leverage order is:

1. choose a real data ingestion source
2. replace the heuristic interpreter with a model-backed version
3. improve eval quality and regression reporting
4. deploy it to a hosted environment

## Issue Candidates

These are ready to become GitHub issues later:

- Add provider abstraction for model-backed planner/interpreter/critic
- Support importing discourse data from CSV or bookmarks
- Add experiment runner for prompt and retrieval comparisons
- Persist run history and eval history
- Deploy Agent Design Lab to a public subdomain
