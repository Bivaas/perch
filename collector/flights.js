import { readFile } from "node:fs/promises";


const GAP_MINUTES = 10;
const AIRPORT = { lat: 27.6966, lon: 85.3591};

// shortest distance 
function distanceNm(lat, lon) {

    const toRad = (deg * Math.PI) / 180;
    const dLat = toRad(lat - AIRPORT.lat);
    const dLon = toRad(lon - AIRPORT.lon);
    
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(AIRPORT.lat)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2;

    return 2 * 3440.065 * Math.asin(Math.sqrt(a));
}

const text = await readFile("positions.jsonl", "utf8");
const rows = text.trim().split("\n").map((line) => JSON.parse(line));

const flights = [];
const current = {};


for (const row of rows) {

    const flight = current[row.hex];
    const gap = flight === undefined ? Infinity : new Date(row.time) - new Date(flight.end);

    if (gap > GAP_MINUTES * 60 * 1000) {

        current[row.hex] = { hex: row.hex, callsign: row.flight?.trim(), start: row.time, end: row.time, points: 1};  
        flights.push(current[row.hex]);
        } 

        else {

            flight.end = row.time;
            flight.points += 1;
            flight.callsign ??= row.flight?.trim();
        }
    }


    console.log(`${flights.length} no of flights found:`);
    console.table(flights);