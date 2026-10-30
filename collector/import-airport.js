import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const AIRPORTS_URL = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv";

const RUNWAYS_URL = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/runways.csv";

const SUPABASE_URL = "https://knzexkjvrsoeyxxzwqxl.supabase.co";
// airport in each req
const BATCH_SIZE = 1000;

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

const byCode = {};
const identToIcao = {};

for (const r of airports) {

    const icao = codeOf(r);

    if (byCode[icao]) continue;

    identToIcao[r.ident] = icao;
    byCode[icao] = {

        icao,
        name: r.name,
        country: r.iso_country,
        type: r.type,
        lat: Number(r.latitude_deg),
        lon: Number(r.longitude_deg),

        elevation_ft: r.elevation_ft === "" ? null : Number(r.elevation_ft),
        
    };
    }

    const records = Object.values(byCode);
    console.log(`${records.length} unique codes`);


const supabase = createClient(

    SUPABASE_URL,
     process.env.SUPABASE_SECRET_KEY
);

async function saveInBatches(table, list) {

    for (let i = 0; i < list.length; i += BATCH_SIZE) {

        const batch = list.slice(i, i + BATCH_SIZE);

        const { error } = await supabase

            .from(table)
            .upsert(batch);

        if (error) {

            console.log('err:', error.message);
            return;
        }

        console.log(`${table}: ${i + batch.length} saved`);
    }
}

await saveInBatches("airports", records);


const runwayText = await (

    await fetch(RUNWAYS_URL)
).text();

const runwayRows = parse(runwayText, { colums: true});

const runways = runwayRows .filter( 

    (r) => identToIcao[r.airport_ident] &&
            r.closed === "0" &&
            r.le_latitude_deg !== "" &&
            r.he_latitude_deg !== ""
)

.map((r) => ({

    id: Number(r.id),
    icao: identToIcao[r.airport_ident],
    name: `${r.le_ident}/${r.he_ident}`,
    length_ft: r.length_ft === "" ? null : Number(r.length_ft),

    le_lat: Number(r.le_latitude_deg),
    le_lon: Number(r.le_longitude_deg),
    he_lat: Number(r.he_latitude_deg),
    he_lon: Number(r.he_longitude_deg),

}));

await saveInBatches("runways", runways);
