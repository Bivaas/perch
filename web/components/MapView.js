"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";

const CENTER = [27.6966, 85.3591];

const RUNWAY = [

    [27.6838, 85.3534],
    [27.7094, 85.3648],
];

const COLORS = {

    descend: "#2563eb",
    climb: "#16a34a",
    level: "#9333ea",
    ground: "#6b7280",
}

export default function MapView({ aircraft }) {

    return (

        <>

        <MapContainer center={CENTER} zoom={9} style={{ height: "500px" }} >

            <TileLayer 

                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors" />

                {/* rwy line */}
                <Polyline positions={RUNWAY} pathOptions={{ color: "black", weight: 4 }} />

                {/* single dot */}
                {aircraft.map((a) => (

                    <CircleMaker key={a.hex} center={[a.lat, a.lon]} radius={6} pathOptions={{ color: COLORS[a.status] }}>

                        <Tooltip>

                            {a.flight ?? a.hex} -{" "}
                            {a.on_ground ? "ground" : `${a.alt} ft`} -{" "}
                            {a.status}

                        </Tooltip>

                    </CircleMaker>
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