import { supabase } from "@/lib/supabase";

const RADIUS_KM = 100;

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {

        return Response.json(
            {error: "lat & lon required !"},
            { status: 400}
        );
    }

    const { data, error} = await supabase.rpc("nearby_airports", 
        {

            p_lat: Number(lat),
            p_lon: Number(lon),
            p_km: RADIUS_KM,
        }
    );

    if (error) {

        return Response.json(

            {err: error.message },
            { status: 500 }
        );
    }

    return Response.json(data);
}