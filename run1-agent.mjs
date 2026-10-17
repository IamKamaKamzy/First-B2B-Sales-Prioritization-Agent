
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
You are helping with a B2B sales prospect-prioritization task.

GOAL
Identify which prospects should be followed up first.

SOURCE
Use only the sanitized CSV provided below.
Do not use web research or invent missing information.

AVAILABLE DATA
Lead ID, Name, Segment, Source, Engagement, Last Contact Date.

INTENTIONALLY WITHHELD FOR RUN 1
Status, pain points, notes, contact method, date added,
phone numbers, email addresses, and LinkedIn URLs.

TASK
Create a concise Run 1 Prospect Prioritization Report containing:

1. Top 10 prospects to follow up first.
2. Why each prospect was prioritized.
3. A recommended next action for each.
4. Five prospects to defer, with reasons.
5. Missing information that limits your decisions.
6. A short work log explaining what you reviewed,
   what you decided, and what you could not determine.

QUALITY RULES
Base decisions on the CSV.
Clearly separate facts from assumptions.
Do not invent details.
If the data is insufficient, say so.
`;

const result = await callModel(client, {
  model: "liquid/lfm-2.5-2.6b:free",
  input: `${instructions}

--- PROSPECT DATA ---
${csv}
--- END DATA ---`,
});

console.log("\n===== MERCOR CAPSTONE: RUN 1 =====\n");
console.log(await result.getText());
console.log("\n===== USAGE =====\n");
console.log(await result.getUsage());
