import { cacheLife } from "next/cache";
import { supabase} from "@/lib/supabase";

const ADSB_URL = "https://api.adsb.lol/v2/point";
const RADIUS = 40;
const CLIMB = 300;
const GAP_BASE = 1500;
const GAP_RATIO = 0.1;

// 15 sec traffic cache
async function getTraffic(lat, lon) {

    "use cache"
    cacheLife({ stale: 15, revalidate: 15, expire: 60 });

    const res = await fetch (

        `${ADSB_URL}/${lat}/${lon}/${RADIUS}`
    );

    const data = await res.json();

    const aircraft = data.ac
        .filter((a) => a.lat !== undefined)
        .map((a) => {

            const onGround = a.alt_baro === "ground";

            let status = "cruise";

            if (onGround) {

                status = "on ground";

            } else if (a.baro_rate < -CLIMB ) {

                status = "descend";
            }
            else if (a.baro_rate > CLIMB ) {

                status = "climb";
            }

            // nav accuracy
            let gps = "unknown";
            if (a.nac_p !== undefined) {

                gps = a.nac_p >= 8 ? "ok" : "degraded";
            }

            // alt mismatch
            let altGap;
            if (
                typeof a.alt_baro === "number" && a.alt_geom !== undefined 
            ) 
            {
                altGap = a.alt_geom - a.alt_baro;

                const limit = GAP_BASE + GAP_RATIO * a.alt_baro;

                if ( gps !== "degraded" && Math.abs(altGap) > limit) {

                    gps = "mismatch";
                }
            }

            return {

                hex: a.hex,
                flight: a.flight?.trim(),
                lat: a.lat,
                lon: a.lon,
                alt: onGround ? null : a.alt_baro,
                on_ground: onGround,
                status,
                gps,
                nacp: a.nac_p,
                altGap,
                track: a.track,
                type: a.t,
                reg: a.r,
            };
        });


        const prefixes = aircraft

            .filter((a) => /^[A-Z]{3}[0-9]/.test(a.flight ?? ""))
            .map((a) => a.flight.slice(0, 3));

        const { data: airlines } = await supabase

            .from("airlines")
            .select("icao, name")
            .in("icao", prefixes);

        const names = {};

        for (const al of airlines ?? []) {
            names[al.icao] = al.name;
        }

        return aircraft.map((a) => ({
            ...a,
            airline: names[a.flight?.slice(0, 3)],
        }));
}

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {

        return Response.json(

            { error: "lat and lon required !"},
            { status: 400}
        );
    }


    const aircraft = await getTraffic(

        Number(lat).toFixed(4),
        Number(lon).toFixed(4)
    );

    return Response.json(aircraft);
}
