import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LiveMap from "@/components/LiveMap";

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

            <h2>METAR</h2>
            <p>

                {metar ? metar.rawOb
                        : "no METAR available for this airport !"}

            </p>

            {/*  map */}
            <h2>Live traffic</h2>

            <LiveMap key={airport.icao} url={trafficUrl} center={[airport.lat, airport.lon]} runways={runwayLines} />


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