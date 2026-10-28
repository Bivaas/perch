import { createClient } from "@supabase/supabase-js";
import { AIRPORT, addRow, GAP_MINUTES, classify } from "./tracker.js";


const RADIUS_NM = 80;
const url = `https://api.adsb.lol/v2/point/${AIRPORT.lat}/${AIRPORT.lon}/${RADIUS_NM}`;
const POLL_SECONDS = 15;
const SUPABASE_URL = "https://knzexkjvrsoeyxxzwqxl.supabase.co";

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const current = {};

async function poll() { 

    try {

        
        const res = await fetch(url);
        const data = await res.json();
        const time = new Date().toISOString();
        const finished = [];
        
        console.log(`${time} ${data.ac.length} aircraft within ${RADIUS_NM} nm of ${AIRPORT.code}`);
        
        for (const plane of data.ac) {
            
            console.log(plane.hex, plane.flight, plane.alt_baro

            );

        const row = { time, hex: plane.hex, flight: plane.flight, lat: plane.lat, lon: plane.lon, alt: plane.alt_baro };

        const ended = addRow(current, row);

        if (ended) finished.push(ended);
    }

    for (const f of Object.values(current)) {

        const unseen = new Date(time) - new Date(f.end);

        if (unseen > GAP_MINUTES * 60 * 1000) {

            finished.push(f);
            delete current[f.hex];
        }
    }

    for (const f of finished) {

        console.log("finished:", f.callsign, classify(f));
    }

    console.log (Object.keys(current).length, "open flights");

    
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

        // finished flight
        if (finished.length > 0) {

            const flightRows = finished.map((f) => ({

                airport: AIRPORT.code,
                hex: f.hex,
                callsign: f.callsign,
                first_seen: f.start,
                last_seen: f.end,
                points: f.points,
                min_alt: f.minAlt,
                min_dist_nm: f.minDist,
                first_alt: f.firstAlt,
                last_alt: f.lastAlt,
                type: classify(f),
            }));

            const { error: flightError } = await supabase
                .from("flights")
                .insert(flightRows);

            if (flightError) {

                console.log("flights err:", flightError.message);
            }

            console.log (finished.length, "flight info saved !");
        }
    }
    catch (err) {

        console.log(new Date().toISOString(), "pool failed:", err.message);
    }
}

poll();
setInterval(poll, POLL_SECONDS * 1000);