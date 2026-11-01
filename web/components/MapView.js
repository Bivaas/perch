"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";


const COLORS = {

    descend: "#2563eb",
    climb: "#16a34a",
    cruise: "#9333ea",
    "on ground": "#6b7280",
}

const RING_COLORS = {

    degraded: "red",
    mismatch: "orange",
}

export default function MapView ({ aircraft, center, runways }) {

    // nacp & alt
    const flagged = aircraft.filter(

        (a) => RING_COLORS[a.gps]
    );

    const degraded = flagged.filter(

        (a) => a.gps === "degraded"
    );

    const mismatch = flagged.filter(

        (a) => a.gps === "mismatch"
    );
    

    return (

        <>

        <MapContainer center={center} zoom={9} style={{ height: "500px" }} >

            <TileLayer 

                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors" />

                {/* rwy line */}
                {runways.map((r, i) => (

                    <Polyline key={i} positions={r} pathOptions={{ color: "black", weight: 4 }}/>
                ))}

                {/* accuracy ring */}
                {flagged.map((a) => (

                    <CircleMarker 

                        key={`gps-${a.hex}`}
                        center={[a.lat, a.lon]}
                        radius={11}
                        pathOptions={{

                            color: RING_COLORS[a.gps],
                            dashArray: "4",
                            fill: false,
                }} />

                ))}

                {/* single dot */}
                {aircraft.map((a) => (

                    <CircleMarker key={a.hex} center={[a.lat, a.lon]} radius={6} pathOptions={{ color: COLORS[a.status] }}>

                        <Tooltip>

                            {a.flight ?? a.hex} -{" "}
                            {a.on_ground ? "ground" : `${a.alt} ft`} -{" "}
                            {a.status}
                            {a.gps === "degraded" && ` - GPS degraded (with NACp of ${a.nacp} )` }
                            {a.gps === "mismatch" && ` - GPS/pressure altitude gap ${a.altGap} ft`}

                        </Tooltip>

                    </CircleMarker>
                ))}

            </MapContainer>

            {/*  aircraft count */}
            <p>{aircraft.length} Total aircrafts:</p>
            <p>{degraded.length} planes with degraded GPS</p>
            <p>{mismatch.length} planes with altitude mismatch</p>

            <ul>

                {Object.entries(COLORS).map(([status, color]) => (

                    <li key={status}>

                            <span style={{ color }}>|| </span>
                            {status}

                    </li>
                ))}

                <li>

                    <span style={{ color: "red" }}>|| </span>
                    degraded GPS
                </li>

                <li> 

                    <span style={{ color: "orange" }}>|| </span>
                    altitude mismatch
                </li>
            </ul>

            </>
    );
}