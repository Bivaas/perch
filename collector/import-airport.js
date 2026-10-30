import { parse } from "csv-parse/sync";

const AIRPORTS_URL = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv";

const TYPES = [ "large_airport", "medium_airport", "small_airport" ];


function codeOf(r) {

    if (r.icao_code) return r.icao_code;
    if (/^[A-Z]{4}$/.test(r.gps_code)) return r.gps_code;
}

const res = await fetch(AIRPORTS_URL);
const text = await res.text();
const rows = parse(text, { columns: true});

const airports = rows.filter(

    (r) => TYPES.includes(r.type) && codeOf(r)
);

console.log(`${rows.length} no of rows in file`);
console.log(`${airports.length} no of airports kept`);

console.log (

    airports.find((r) => codeOf(r) === "VNKT")
);