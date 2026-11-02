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

        <MapContainer center={center} zoom={9} className="h-80 rounded-lg sm:h-[28rem]" >

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
                            {a.gps === "degraded" && ` - GPS degraded (with NACp ${a.nacp} )` }
                            {a.gps === "mismatch" && ` - GPS/pressure altitude gap ${a.altGap} ft`}

                        </Tooltip>

                    </CircleMarker>
                ))}

            </MapContainer>

            {/*  aircraft count */}
            <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">

                <span className="rounded-full px-5 py-1">{aircraft.length} total aircrafts</span>

                <span className="rounded-full px-6 py-1">{degraded.length} planes has degraded GPS</span>

                <span className="rounded-full px-6 py-1"> {mismatch.length} planes has altitude mismatch</span>

            </div>


            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-1" >

                {Object.entries(COLORS).map(([status, color]) => (

                    <li key={status}  className="flex items-center gap-1.5" >

                        <span className="h-2.5 w-1.5 " style={{ backgroundColor: color }} />
                            = {status}
                    </li>
                ))}

                <li className="flex items-center gap-1.5">

                    <span className="h-3 w-3 rounded-full border-2 border-dashed border-red-500 gap-x-4" />
                    = degraded GPS
                </li>

                <li className="flex items-center gap-1.5">

                    <span className="h-3 w-3 rounded-full border-2 border-dashed border-orange-500" />
                    = altitude mismatch
                </li>

            </ul>

            </>
    );
}