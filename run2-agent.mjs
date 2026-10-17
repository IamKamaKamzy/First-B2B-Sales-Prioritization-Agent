
import { OpenRouter } from "@openrouter/sdk";
import { callModel } from "@openrouter/agent";
import { readFile } from "node:fs/promises";

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const csv = await readFile(
  "./mercor_capstone_sanitized_prospect_workspace.csv",
  "utf8"
);

const instructions = `
You are helping prioritize a B2B sales prospect pipeline.

GOAL
Identify which prospects deserve follow-up attention first.

SOURCE
Use only the sanitized CSV below. Do not use web research
or invent missing information.

AVAILABLE FIELDS
Lead ID, Name, Segment, Source, Engagement, Last Contact Date.

WITHHELD IN RUN 2
Status, pain points, notes, contact method, date added,
phone, email, and LinkedIn URLs.

RULES
1. Rank prospects using evidence in the CSV.
2. Do not assume referrals always mean stronger buying intent.
3. Do not claim records are duplicates unless the CSV proves it.
4. Treat October 9, 2026 as today's date when assessing recency.
5. Do not recommend a specific contact channel when it is unknown.
6. Separate facts from assumptions and explain uncertainty.
7. Do not invent missing dates or lead details.
8. Count the CSV data rows accurately, excluding the header.

OUTPUT
Create a concise Run 2 report containing:
1. Top 10 prospects, ranked, with evidence and next action.
2. Five prospects to defer, with evidence.
3. Your ranking rules.
4. Important data gaps.
5. A work log: what you reviewed, decided, and could not determine.
6. The number of prospect records reviewed.

QUALITY CHECK
Before submitting, verify that each ranking is supported by
the available fields, dates are interpreted correctly, and
unsupported claims have been removed.
`;

const result = await callModel(client, {
  model: "openrouter/free",
  input: `${instructions}

--- PROSPECT DATA ---
${csv}
--- END DATA ---`,
});

console.log("\n===== MERCOR CAPSTONE: RUN 2 =====\n");

const report = await result.getText();

console.log("\n===== REPORT LENGTH =====\n");
console.log("Characters:", report?.length ?? 0);

console.log("\n===== REPORT CONTENT =====\n");
console.log(report);

console.log("\n===== USAGE =====\n");
console.log(await result.getUsage());
