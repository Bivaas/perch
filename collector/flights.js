import { readFile } from "node:fs/promises";
import { addRow, classify } from "./tracker.js";


const text = await readFile("positions.jsonl", "utf8");
const rows = text.trim().split("\n").map((line) => JSON.parse(line));

const flights = [];
const current = {};


for (const row of rows) {

    const ended = addRow(current, row);
    if (ended) flights.push(ended);
}

flights.push(...Object.values(current));

    for (const f of flights) {

        f.type = classify(f);
    }


    console.log(`${flights.length} no of flights found:`);
    console.table(flights);