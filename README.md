# First B2B Sales Prioritization Agent

My first agentic AI project, exploring how an AI agent can help prioritize B2B sales prospects and how clear instructions and human review can improve the quality of its outputs.

## Project Goal

Explore how an AI agent can use available prospect information to recommend which leads deserve attention first, explain its reasoning, identify missing information, and suggest next steps without inventing facts.

## Tech Stack

- JavaScript (ES modules)
- Node.js
- OpenRouter SDK
- OpenRouter Agent
- Zod

## Experiments

### Run 1 — Initial Instructions
The first run generated a prospect prioritization report. Reviewing the output revealed issues such as unsupported assumptions, an inaccurate record count, and incorrect date interpretation.

### Run 2 — Improved Instructions
The second run added stricter guidance around evidence, missing information, referral sources, duplicate records, and date interpretation. Some issues improved, although inconsistencies and weak ranking decisions remained.

### Run 3 — Validation Attempt
The third run was intended to improve data validation and avoid unsupported rankings. It timed out, so it is not treated as a successful experiment.

## Key Learnings

- Clear agent instructions matter.
- Missing data should be acknowledged, not guessed.
- A fluent report is not necessarily a reliable report.
- Human review and validation are essential.
- Experiment results should be documented honestly.

## Data and Privacy

The original working dataset is excluded from this public repository. No private prospect contact information or API credentials should be committed. A fictional sample dataset may be added later for reproducibility.

## Setup

Requirements: Node.js and an OpenRouter API key.

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set the `OPENROUTER_API_KEY` environment variable in your local terminal.
4. Run an experiment with `node run1-agent.mjs`, `node run2-agent.mjs`, or `node run3-agent.mjs`.

Model availability and provider limits may affect whether a run succeeds. Never put API keys directly in source code or commit them to GitHub.

## Limitations

The ranking quality is limited by the fields available in the working dataset. The experiments do not establish that the recommendations increase sales or conversion rates. Run 3 did not complete successfully.

## Project Status

Learning project — iterative experiments and documentation.
