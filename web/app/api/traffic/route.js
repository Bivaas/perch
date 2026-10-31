import { cacheLife } from "next/cache";

const ADSB_URL = "https://api.adsb.lol/v2/point";
const RADIUS = 40;
const CLIMB = 300;

// 15 sec traffic cache
async function getTraffic(lat, lon) {

    "use cache"
    cacheLife({ stale: 15, revalidate: 15, expire: 60 });

    const res = await fetch (

        `${ADSB_URL}/${lat}/${lon}/${RADIUS}`
    );

    const data = await res.json();

    return data.ac 
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

            return {

                hex: a.hex,
                flight: a.flight?.trim(),
                lat: a.lat,
                lon: a.lon,
                alt: onGround ? null : a.alt_baro,
                on_ground: onGround,
                status,
            };
        });

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
