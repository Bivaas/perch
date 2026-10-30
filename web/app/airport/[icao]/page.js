import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function AirportPage({ params }) {

    const { icao } = await params;
    const code = icao.toUpperCase();

    const { data: airports, error } = await supabase 
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

    const { data: runways } = await supabase
        .from("runways")
        .select("id, name, length_ft")
        .eq("icao", code);

    
    return (

        <main>
            <h1>

                {airport.icao} - {airport.name}

            </h1>

            <p>

                {airport.city}, {airport.country} - elevation{" "}
                {airport.elevation_ft ?? "unknown"} ft
            </p>

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