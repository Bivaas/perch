import { supabase } from "@/lib/supabase";

const AIRPORT = "VNKT";
const WINDOW_SECONDS = 60;
const CLIMB_FT = 200;

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

        // newest aircraft with status
       const latest = {};
       const oldest = {};

       for (const p of data) {

            latest[p.hex] ??= p;
            oldest[p.hex] = p;
       }

       const aircraft = Object.values(latest).map((p) => {

            const change = p.alt - oldest[p.hex].alt;

            let status = "cruise";

            if (p.on_ground) {

                status = "on ground";
            } 
            else if (change < -CLIMB_FT) {

                status = "descend";
            }
            else if (change > CLIMB_FT) {

                status = "climb";
            }

            return { ...p, status};
       });

       return Response.json(aircraft);
}