
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
Be conservative: do not create false confidence in rankings.

SOURCE
Use only the sanitized CSV provided below.
Do not use web research or invent missing information.

AVAILABLE FIELDS
Lead ID, Name, Segment, Source, Engagement, Last Contact Date.

WITHHELD FIELDS
Status, pain points, notes, contact method, date added,
phone, email, and LinkedIn URLs.

VALIDATION RULES
1. Count data rows, excluding the header.
2. Check that each row has a Lead ID.
3. Count missing Engagement values and missing Last Contact Dates.
4. Check date values for valid calendar dates.
5. Do not silently correct invalid dates.
6. If a count cannot be verified, say so.

RANKING RULES
1. Use only evidence in the CSV.
2. Engagement marked "Yes" indicates 2+ touchpoints,
   not necessarily buying intent.
3. Do not assume referrals or any segment automatically
   mean stronger buying intent.
4. Do not use Lead ID order as evidence of recency or value.
5. If the data cannot distinguish prospects, group them
   as tied or equally supported instead of inventing a ranking.
6. Do not claim records are duplicates without sufficient evidence.
7. Do not recommend a contact channel if it is unknown.
8. Treat October 10, 2026 as today's date when assessing recency.
9. Separate facts from assumptions and state uncertainty.

OUTPUT
Create a concise Run 3 report with:

1. Data validation:
   - Number of prospect records
   - Missing Engagement values
   - Missing Last Contact Dates
   - Invalid dates, if any

2. Top prospects:
   - Lead ID and Name
   - Available evidence
   - Priority or tied group
   - Recommended next action

3. Five prospects to defer, only if evidence supports
   deferring them. Otherwise explain why deferral is uncertain.

4. Ranking rules and important data gaps.

5. Work log: what you reviewed, decided, and could not determine.

FINAL CHECK
Check that counts are consistent, dates are valid,
and each conclusion is supported by the CSV.
Do not claim a check passed unless you performed it.
`;

const result = await callModel(client, {
  model: "openrouter/free",
  input: `${instructions}

--- PROSPECT DATA ---
${csv}
--- END DATA ---`,
});

const report = await result.getText();

console.log("\n===== MERCOR CAPSTONE: RUN 3 =====\n");
console.log(report);
console.log("\n===== REPORT LENGTH =====\n");
console.log("Characters:", report?.length ?? 0);
console.log("\n===== USAGE =====\n");
console.log(await result.getUsage());
