import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LiveMap from "@/components/LiveMap";
import { nepalTime } from "@/lib/nepalTime";
import HourlyChart from "@/components/HourlyChart";

const WATCHED = {VNKT: "Asia/Kathmandu", OMDB: "Asia/Dubai"};

const TY_STYLE = {

    arrival: "text-blue-700",
    departure: "text-green-700",
};

const METAR_URL = "https://aviationweather.gov/api/data/metar";

const CLOUD_TYPES = {

    FEW: "few",
    SCT: "scattered",
    BKN: "broken",
    OVC: "overcast",
    CLR: "clear",
    CAVOK: "no significant cloud"
};

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
        const timeZone = WATCHED[code];
        const watched = timeZone !== undefined;
        let flights = [];
        let hourly = [];
        const names = {};

        if (watched) {

            const { data } = await supabase

                .from("flights")
                .select("id, hex, callsign, type, last_seen")
                .eq("airport", code)
                .in ("type", ["arrival", "departure"])
                .order("last_seen", { ascending: false })
                .limit (20);
            
                flights = data ?? [];

                // load airlines
                const prefixes = flights
                    .filter((f) => /^[A-Z]{3}[0-9]/.test(f.callsign ?? ""))

                    .map((f) => f.callsign.slice(0, 3));

                const { data: airlines } = await supabase
                    .from("airlines")
                    .select("icao, name")
                    .in("icao", prefixes);

                for (const al of airlines ?? []) {

                    names[al.icao] = al.name;
                }

                // hour count load
                const { data: hours } = await supabase
                    .rpc("hourly_traffic_local", {
                        p_airport: code,
                        p_tz: timeZone,
                    });

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

        <main className="space-y-4">

            <div>
                <h1 className="text-2xl font-bold">

                    <span className="font-mono text-sky-800">{airport.icao}</span>
                        {" "} {airport.name}
                </h1>

                <p className="mt-1 text-slate-800">

                    {airport.city}, {airport.country}
                    {" - "}elevation{" "}
                    {airport.elevation_ft ?? "unknown"}
                </p>

            </div>

            <Section title="METAR">

                <p className="break-words text-sm">

                    {metar ? metar.rawOb 
                        : "No METAR available for this airport"}
                </p>

                {/* wind */}
                {metar && (
                    <ul>
                        <li>

                            Wind: {" "}
                            {metar.wspd === 0
                                ? "calm"
                                : metar.wdir === "VRB"
                                ? `variable at ${metar.wspd} kt`
                                : `${metar.wdir} ° at ${metar.wspd} kt`}
                            {metar.wgst && ` gusting at ${metar.wgst} kt`}

                        </li>

                        <li>
                            temperature: {metar.temp}°c and dew point{" "}
                            {metar.dewp ?? "?"}°c
                        </li>

                        <li>QNH: {metar.altim}</li>

                        <li>
                            clouds: {" "}
                            {metar.clouds.length === 0
                            
                                ? "none reported"
                                : metar.clouds
                                    .map((c) => {
                                        const name = CLOUD_TYPES[c.cover] ?? c.cover;

                                        return c.base
                                            ? `${name} at ${c.base} ft`
                                            : name;
                                        
                                    })    
                                    .join(", ")}
                            
                        </li>

                    </ul>
                )}

            </Section>

            {/* map */}
            <Section title="live traffic:">

                    <LiveMap 
                        key={airport.icao}
                        url={trafficUrl}
                        center={[airport.lat, airport.lon]}
                        runways={runwayLines} 
                    />

            </Section>

            {/* show list */}
           <Section title="recent arrivals and departures:">

                    {!watched ? (
                        <p>history is only for VNKT & OMDB</p>
                    ) : flights.length === 0 ? (

                        <p className="text-sm">No finished flights so far</p>
                    ) : (

                        <ul className="divide-y">

                             {flights.map((f) => (

                                <li key={f.id} className="flex items-center gap-3 py-2 text-sm" >

                                    <span className="flex-1 font-medium">
                                        
                                        {f.callsign ?? f.hex}
                                        {names[f.callsign?.slice(0, 3)] &&
                                            `${names[f.callsign.slice(0, 3)]} -`}
                                        
                                    </span>

                                    <span className={`rounded-full px-2 py-0.5 text-sm ${TY_STYLE[f.type]}`}> {f.type} </span>

                                    <span className="w-24 text-right">

                                        {nepalTime.format(
                                            new Date(f.last_seen)
                                        )}
                                    </span>
                                </li>
                             ))}
                        </ul>
                    )
                    }

           </Section>

           {/* chart */}
            {watched && (

                <Section title="traffic by hourly basis:">

                    <HourlyChart data={hourly} />

                </Section>
                )}

                <Section title="Runway info:">

                    {runways.length === 0 ? (
                        
                        <p className= "text-sm tet-slate-500">No runway data available :( </p>
                        
                    ) : (
                        <ul className="space-y-1 text-sm">

                            {runways.map((r) => (

                                <li key={r.id}>

                                    <span className="font-mono">{r.name}</span>

                                    {" - "}
                                    {r.length_ft ?? "?"} ft
                                </li>
                            ))}
                        </ul>
                    )
                        }

                </Section>



        </main>
    );
}

function Section({ title, children }) {

    return (

        <section className="border-none p-4">

            <h2 className="mb-3 font-bold">{title}</h2>

            {children}

        </section>
    );
}