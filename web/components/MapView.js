"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

const CENTER = [27.6966, 85.3591];

export default function MapView({ aircraft }) {

    return (

        <MapContainer center={CENTER} zoom={9} style={{ height: "500px" }} >

            <TileLayer 

                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors" />

                {/* single dot */}
                {aircraft.map((a) => (

                    <CircleMaker key={a.hex} center={[a.lat, a.lon]} radius={6} >

                        <Tooltip>

                            {a.flight ?? a.hex} -{" "}
                            {a.on_ground ? "ground" : `${a.alt} ft`}
                        </Tooltip>

                    </CircleMaker>
                ))}

            </MapContainer>
    );
}