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

        <div className="mt-6">

            <form onSubmit = {searchCity} className="flex gap-2">

                <input value={query} 

                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="city name"
                        className="min-w-0 flex-1 rounded-lg border border-slate-400 bg-white px-3 py-2 outline-none" 
                        
                />

                <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-750" >

                    search

                </button>

            </form>

            {/* use my location btn */}
            <button onClick={findNearMe} className="mt-3 text-sm font-medium text-sky-600 hover:underline" >
                Use device location
            </button>

            <p className="mt-4 text-sm text-slate-600">{message}</p>

            {/* airport results  */}
            <ul className="mt-2 space-y-2">

                {airports.map((a) => (

                    <li key={a.icao}>

                        <Link href={`/airport/${a.icao}`} className="flex items-center gap-3 border border-slate-400 p-3" >

                            <span className="w-14 py-1 shrink-0 rounded text-center text-sky-700 font-mono" >

                                {a.icao}

                            </span>

                            <span className="min-w-0 flex-1">

                                <span className="block font-medium" > {a.name}</span>

                                <span className="block text-slate-530">{a.city}</span>

                            </span>

                                <span className="shrink-0 text-sm text-slate-500"> {a.distance_km.toFixed(1)} km </span>

                    </Link>

                    </li>

                ))}
            </ul>

        </div>
    );

}