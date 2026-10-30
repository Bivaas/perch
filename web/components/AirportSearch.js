"use client";

import Link from "next/link";
import { useState } from "react";

export default function AirportSearch() {

    const [airports, setAirports] = useState([]);
    const [message, setMessage] = useState("");


    function findNearMe() {

        setMessage("searching for your location...");

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const { latitude, longitude } = position.coords;

                const res = await fetch( 
                    `/api/nearby?lat=${latitude}&lon=${longitude}`
                );

                const data = await res.json();

                setAirports(data);
                setMessage(
                    data.length ? "" : "no airports found ! "
                );
            },
        
            () => setMessage("location permission denied !")
        );
        
    }

    return (

        <div>

            <button onClick={findNearMe}>Use my location</button>
            <p>{message}</p>

            <ul>
                {airports.map((a) => (

                    <li key={a.icao}>

                        <Link href={`/airport/${a.icao}`}>
                            {a.icao} - {a.name}
                        </Link> {" "}

                        - {a.city} - {a.distance_km.toFixed(1)} km

                    </li>
                ))}
            </ul>

        </div>
    );

}