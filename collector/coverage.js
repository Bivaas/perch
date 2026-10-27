import { readFile } from "node:fs/promises";

const text = await readFile("positions.jsonl", "utf8");
const rows = text.trim().split("\n").map((line) => JSON.parse(line));
console.log(`${rows.length} no of positions saved`);

const lowest = {};

for (const row of rows) {

    const alt = row.alt === "ground" ? 0 : row.alt;


    if (alt === undefined) continue;

    if (lowest[row.hex] === undefined || alt < lowest[row.hex].alt) {

        lowest[row.hex] = { flight: row.flight, alt };
    }
}

console.table(lowest);