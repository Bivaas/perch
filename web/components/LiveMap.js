"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapView = dynamic(() => import("./MapView"), {

    ssr: false,
});

const REFRESH_SECONDS = 15;

// aircraft fetch & refresh
export default function LiveMap() {

    const [aircraft, setAircraft] = useState([]);

    useEffect(() => {

        function load() { fetch("/api/live")

            .then((res) => res.json())
            .then((data) => setAircraft(data));
        }

        load();

        const id = setInterval(load, REFRESH_SECONDS * 1000);
        return () => clearInterval(id);
    }, []);

    return <MapView aircraft = {aircraft} />
}