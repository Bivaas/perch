"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";


const COLORS = {

    descend: "#2563eb",
    climb: "#16a34a",
    cruise: "#9333ea",
    "on ground": "#6b7280",
}

export default function MapView ({ aircraft, center, runways }) {

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

                {/* single dot */}
                {aircraft.map((a) => (

                    <CircleMarker key={a.hex} center={[a.lat, a.lon]} radius={6} pathOptions={{ color: COLORS[a.status] }}>

                        <Tooltip>

                            {a.flight ?? a.hex} -{" "}
                            {a.on_ground ? "ground" : `${a.alt} ft`} -{" "}
                            {a.status}

                        </Tooltip>

                    </CircleMarker>
                ))}

            </MapContainer>

            {/*  aircraft count */}
            <p>{aircraft.length} no of aircrafts:</p>

            <ul>

                {Object.entries(COLORS).map(([status, color]) => (

                    <li key={status}>

                            <span style={{ color }}>-</span>
                            {status}

                    </li>
                ))}
            </ul>

            </>
    );
}