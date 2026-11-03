import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const AIRLINES = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat";

const SEARCH = [ 

    "id", "name", "alias", "iata", "icao", "callsign", "country", "active" 
];

const SUPABASE = "https://knzexkjvrsoeyxxzwqxl.supabase.co"
const SIZE = 1000;

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
    
    const supabase = createClient(

        SUPABASE,
        process.env.SUPABASE_SECRET_KEY
    );

    for (let i = 0; i < records.length; i += SIZE) {

        const batch = records.slice(i, i + SIZE)

        const { error } = await supabase 
            .from("airlines")
            .upsert(batch);

        if (error) {

            console.log (error.message);
            break;
        }

        console.log (`${i + batch.length} records saved!`);
    }
