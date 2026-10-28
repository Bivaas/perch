import { supabase } from "@/lib/supabase";


// nepal time format
const nepalTime = new Intl.DateTimeFormat("en-GB", {

  timeZone: "Asia/Kathmandu", 
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

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
              
              {nepalTime.format(new Date(f.last_seen))}

            </li>
          ))}

        </ul>

      </main>
    )
}