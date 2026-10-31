import { readFile } from "node:fs/promises";
import { AIRPORTS, addRow, classify } from "./tracker.js";


const AIRPORT = AIRPORTS[0];

const text = await readFile("positions.jsonl", "utf8");
const rows = text.trim().split("\n").map((line) => JSON.parse(line));

const flights = [];
const current = {};


for (const row of rows) {

    const ended = addRow (current, row, AIRPORT);
    if (ended) flights.push(ended);
}

flights.push(...Object.values(current));

    for (const f of flights) {

        f.type = classify(f, AIRPORT);
    }


    console.log(`${flights.length} no of flights found:`);
    console.table(flights);