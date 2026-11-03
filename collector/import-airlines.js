import { parse } from "csv-parse/sync";

const AIRLINES = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat";

const SEARCH = [ 

    "id", "name", "alias", "iata", "icao", "callsign", "country", "active" 
];

const res = await fetch(AIRLINES);
const text = await res.text();
const rows = parse(text, { columns: SEARCH });

console.log(`${rows.length} no of rows in file`);


const byCode = [];

for (const r of rows) {

    if (!/^[A-Z]{3}$/.test(r.icao)) continue;

    const old = byCode[r.icao];
    if (old && old.active === "Y") continue;

    byCode[r.icao] = r;
}

    const records = Object.values(byCode).map((r) => ({

        icao: r.icao,
        name: r.name.trim(),
        country: r.country === "\\N" ? null : r.country,
    }))

    console.log(`${records.length} unique codes`);
    console.log(records.filter((r) => r.country === "Nepal" ));
