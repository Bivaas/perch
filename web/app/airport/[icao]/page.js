import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LiveMap from "@/components/LiveMap";
import { nepalTime } from "@/lib/nepalTime";
import HourlyChart from "@/components/HourlyChart";

const WATCHED = ["VNKT", "VNVT"];
const METAR_URL = "https://aviationweather.gov/api/data/metar";

export default async function AirportPage({ params }) {

    const { icao } = await params;
    const code = icao.toUpperCase();

    const { data: airport, error } = await supabase 
        .from("airports")
        .select("*")
        .eq("icao", code)
        .maybeSingle();

    if (error) {

        return <p> couldn't load airport: {error.message} </p>
    }

    if (!airport) {
        notFound();
    }

    // runway endpoints
    const { data: runways } = await supabase
        .from("runways")
        .select ("id, name, length_ft, le_lat, le_lon, he_lat, he_lon")
        .eq("icao", code);

        // fetch METAR
        let metar;

        try {

            const res = await fetch(

                `${METAR_URL}?ids=${code}&format=json`,
                {
                    headers: {
                        "User-Agent": "Perch",
                    },
                }
            );

            if (res.status === 200) {

                const list = await res.json();
                metar = list[0];
            }

        } catch {

            console.log("METAR fetch failed !");
        }

        // recent views
        const watched = WATCHED.includes(code);
        let flights = [];
        let hourly = [];

        if (watched) {

            const { data } = await supabase

                .from("flights")
                .select("id, hex, callsign, type, last_seen")
                .eq("airport", code)
                .in ("type", ["arrival", "departure"])
                .order("last_seen", { ascending: false })
                .limit (20);
            
                flights = data ?? [];

                // hour count load
                const { data: hours } = await supabase

                    .from("hourly_traffic")
                    .select("hour, arrivals, departures")
                    .eq("airport", code);

                hourly = Array.from({ length: 24}, (_, hour) => {

                    const found = (hours ?? []).find (

                        (h) => h.hour === hour
                    );

                    return {

                        hour: String(hour).padStart(2, "0"),
                        arrivals: found?.arrivals ?? 0,
                        departures: found?.departures ?? 0,
                    };
                });
        }

        // map value
        const trafficUrl = `/api/traffic?lat=${airport.lat}&lon=${airport.lon}`;

        const runwayLines = runways.map((r) => [
            [r.le_lat, r.le_lon],
            [r.he_lat, r.he_lon],
        ]);
    
    return (

        <main>
            <h1>

                {airport.icao} - {airport.name}

            </h1>

            <p>

                {airport.city}, {airport.country} - elevation{" "}
                {airport.elevation_ft ?? "unknown"} ft
            </p>

            <h2>METAR:</h2>
            <p>

                {metar ? metar.rawOb
                        : "no METAR available for this airport !"}

            </p>

            {/*  map */}
            <h2>Live traffic</h2>

            <LiveMap key={airport.icao} url={trafficUrl} center={[airport.lat, airport.lon]} runways={runwayLines} />

            {/* show list */}
            <h2>Recent arrivals and departure:</h2>

            {!watched ? (
                <p>History is only for VNKT & VNVT</p> )

                : flights.length === 0 ? (
                    
                    <p>No finished flights recorded till now</p> 
                ) : (
                    <ul>

                        {flights.map((f) => (

                            <li key={f.id}>

                                {f.callsign ?? f.hex} - {f.type} -{" "}
                                {nepalTime.format(new Date(f.last_seen))
                                }
                            </li>
                        ))}
                    </ul>
                )
            
            }

            {/* chart */}
            {watched && (
                <>
                
                    <h2>Traffic shown on hourly basis:</h2>
                    <HourlyChart data={hourly} />
                
                </>
            )}

            <h2>Runways </h2>
            <ul>

                {runways.map((r) => (

                    <li key={r.id}>
                        {r.name} - {r.length_ft ?? "?"} ft
                    </li>
                ))}
            </ul>

        </main>
    );
}