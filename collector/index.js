import { appendFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";


const AIRPORT = { code: "VNKT", lat: 27.6966, lon: 85.3591 };
const RADIUS_NM = 80;
const url = `https://api.adsb.lol/v2/point/${AIRPORT.lat}/${AIRPORT.lon}/${RADIUS_NM}`;
const POLL_SECONDS = 15;
const SUPABASE_URL = "https://knzexkjvrsoeyxxzwqxl.supabase.co";

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function poll() { 

    const res = await fetch(url);
    const data = await res.json();
    const time = new Date().toISOString();

    console.log(`${time} ${data.ac.length} aircraft within ${RADIUS_NM} nm of ${AIRPORT.code}`);

    for (const plane of data.ac) {

        console.log(plane.hex, plane.flight, plane.alt_baro);

        const row = { time, hex: plane.hex, flight: plane.flight, lat: plane.lat, lon: plane.lon, alt: plane.alt_baro };
        await appendFile("positions.jsonl", JSON.stringify(row) + "\n");
    }

        const rows = data.ac.map((plane) => ({

            time,
            airport: AIRPORT.code, 
            hex: plane.hex,
            flight: plane.flight?.trim(),
            lat: plane.lat,
            lon: plane.lon,
            alt: plane.alt_baro === "ground" ? null : plane.alt_baro,
            on_ground: plane.alt_baro === "ground",
        }));

        const { error } = await supabase.from("positions").insert(rows);
        if (error) console.log("err:", error.message);
    
}

poll();
setInterval(poll, POLL_SECONDS * 1000);