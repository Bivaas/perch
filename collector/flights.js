import { readFile } from "node:fs/promises";
import { addRow, classify } from "./tracker.js";

const GAP_MINUTES = 10;

const text = await readFile("positions.jsonl", "utf8");
const rows = text.trim().split("\n").map((line) => JSON.parse(line));

const flights = [];
const current = {};


for (const row of rows) {

    const flight = current[row.hex];
    const gap = flight === undefined ? Infinity : new Date(row.time) - new Date(flight.end);

    const tookOff = flight !== undefined && flight.lastAlt === 0 && typeof row.alt === "number";

    if (gap > GAP_MINUTES * 60 * 1000 || tookOff) {

        current[row.hex] = {

            hex: row.hex,
            callsign: row.flight?.trim(),
            start: row.time,
            end: row.time,
            points: 1,
            minAlt: Infinity,
            minDist: Infinity,
            firstAlt: undefined,
            lastAlt: undefined,
        }

        flights.push(current[row.hex]);
        } 

        else {

            flight.end = row.time;
            flight.points += 1;
            flight.callsign ??= row.flight?.trim();

            const f = current[row.hex];
            const alt = row.alt === "ground" ? 0 : row.alt;

            if (alt !== undefined) {

                const d = distanceNm(row.lat, row.lon);
                const rounded = Math.round(d * 10) / 10;

                f.minDist = Math.min(f.minDist, rounded);
                f.firstAlt ??= alt;
                f.lastAlt = alt;
            }
        }
        
    }


    for (const f of flights) {

        f.type = classify(f);
    }


    console.log(`${flights.length} no of flights found:`);
    console.table(flights);