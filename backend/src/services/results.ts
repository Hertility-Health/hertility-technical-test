import fs from "node:fs/promises";
import path from "node:path";

interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
}

// this would normally be a database query - you don't need to change this function
// export async function fetchResults() {
//   const json: { default: Results[] } = await import("../data/results.json", {
//     assert: { type: "json" },
//   });
//   const results = json.default;
//   return results;
// }

// Zoe problem: Node 22 wants JSON import assertions, TS compiled code didn’t preserve them
// Zoe solution: Replaced the import with this to safely load the JSON at runtime
export async function fetchResults(): Promise<Results[]> {
  const filePath = path.resolve("src/data/results.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const results: Results[] = JSON.parse(raw);

  return results;
}
