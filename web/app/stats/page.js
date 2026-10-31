import { supabase } from "@/lib/supabase";
import HourlyChart from "@/components/HourlyChart";

export default async function StatsPage() {

    const { data: hours, error } = await supabase

        .from("hourly_traffic")
        .select("hour, arrivals, departures")
        .eq("airport", "VNKT")
        .order("hour");


    if (error) {

        return <p>couldn't load stats: {error.message}</p>
    }

    const allHours = Array.from (

        { length: 24},
        (_, hour) => {

            const found = hours.find((h) => h.hour === hour);

            return {

                hour: String(hour).padStart(2, "0"),
                arrivals: found?.arrivals ?? 0,
                departures: found?.departures ?? 0,
            };
        }
    );

    return ( 

        <main> 

            <h1>hourly traffic</h1>
            <p>Nepal time</p>

            <HourlyChart data={allHours} />

            <table> 

                <thead> 

                    <tr>

                        <th>Hour</th>
                        <th>Arrivals</th>
                        <th>Departures</th>

                    </tr>
                </thead>

                <tbody>

                    {hours.map((h) => (

                        <tr key={h.hour}>

                            <td> {String(h.hour).padStart(2, "0")}:00 </td>
                            <td>{h.arrivals}</td>
                            <td>{h.departures}</td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </main>
    )
}