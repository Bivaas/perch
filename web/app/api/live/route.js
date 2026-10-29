import { supabase } from "@/lib/supabase";

const AIRPORT = "VNKT";
const WINDOW_SECONDS = 60;

export async function GET() {

    const since = new Date(
    
        Date.now() - WINDOW_SECONDS * 1000
    ).toISOString();

    const { data, error } = await supabase

        .from ("positions")
        .select("hex, flight, lat, lon, alt, on_ground, time" )
        .eq("airport", AIRPORT)
        .gte("time", since)
        .not("lat", "is", null)
        .order("time", { ascending: false});


        if (error) {

            return Response.json(

                { error: error.message },
                { status: 500 }
            );
        }

        // newest aircraft
       const latest = {};

       for (const p of data) {

        latest[p.hex] ??= p;
       }

       return Response.json(Object.values(latest));
}