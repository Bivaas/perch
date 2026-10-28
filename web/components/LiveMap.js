"use client";

import dynamic from "next/dynamic";

const MayView = dynamic(() => import("./MapView"), {

    ssr: false,
});

export default function LiveMap() {

    return <MapView />;
}