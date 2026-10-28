"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

const CENTER = [27.6966, 85.3591];

export default function MapView() {

    return (

        <MapContainer center={CENTER} zoom={9} style={{ height: "500px" }} >

            <TileLayer 

                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors" />

            </MapContainer>
    );
}