"use client";

import Link from "next/link";
import { useState } from "react";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export default function AirportSearch() {

    const [airports, setAirports] = useState([]);
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");


    async function loadNearby(lat, lon, label) {

        const res = await fetch (`/api/nearby?lat=${lat}&lon=${lon}`);
        const data = await res.json();

        setAirports(data);
        setMessage(data.length

            ? `Airports near ${label}:`
            : `No airports within 100 km of ${label}`
        );
    }

    function findNearMe() {

        setMessage("finding location....");

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const { latitude, longitude } = position.coords;
                loadNearby(latitude, longitude, "your location!");
            },

            () => setMessage ("No location perms!")
        );
    }

    async function searchCity(event) {

        event.preventDefault();
        setMessage("searching.....");

        const name = encodeURIComponent(query);
        const res = await fetch (

            `${GEOCODE_URL}?name=${name}&count=1`
        );
        const data = await res.json();
        const place = data.results?.[0];

        if (!place) {

            setAirports([]);
            setMessage(`no query of ${query} place found !`);
            return;
        }

        loadNearby( place.latitude, place.longitude,
            `${place.name}, ${place.country}`
        );
    }

    return (

        <div>

            <form onSubmit={searchCity}>

                <input value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder = "cityname" />

                <button type="submit">Search</button>

            </form>

            {/* use my location btn */}
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