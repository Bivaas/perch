import { supabase } from "@/lib/supabase";


export default async function Home() {

  const { data: flights, error } = await supabase 

    .from("flights")
    .select("id, hex, callsign, type, last_seen")
    .order("last_seen", { ascending: false })
    .limit(20);

    if (error) {

      return (
        <p>flight not loaded!: {error.message} </p>
      );
    }

    return (

      <main>

        <h1>Perch</h1>
        <p>VNKT (KTM) traffic:</p>

        <ul>

          {flights.map((f) => (

            <li key={f.id}>

              {f.callsign ?? f.hex} - {f.type} -{" "}
              {f.last_seen}
              
            </li>
          ))}

        </ul>

      </main>
    )
}