"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useLayoutEffect } from "react";

const MapView = dynamic(() => import("./MapView"), {

    ssr: false,
});

const REFRESH_SECONDS = 15;

// aircraft fetch & refresh
export default function LiveMap({ url, center, runways}) {

    const [aircraft, setAircraft] = useState([]);

    const [visible, setVisible] = useState(false);

    useLayoutEffect(() => {

        setVisible(true);
        return () => setVisible(false);
    }, []);

    useEffect(() => {

        function load() { fetch(url)

            .then((res) => (res.ok ? res.json() : null ))
            .then ((data) => { if (data) setAircraft(data);
            });
        }

        load();

        const id = setInterval(load, REFRESH_SECONDS * 1000);
        return () => clearInterval(id);
    }, [url]);

    if (!visible) return null;

    return ( <MapView aircraft={aircraft} center={center} runways={runways} /> );
}