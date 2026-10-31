import LiveMap from "@/components/LiveMap";

const VNKT_CENTER = [27.6966, 85.3591];

const VNKT_RW = [

    [
        [27.6838, 85.3534],
        [27.7094, 85.3648],
    ],
];


export default function MapPage() {

    return (

        <main>

                <h1>Live map:</h1>
                <LiveMap url= "/api/live" center={VNKT_CENTER} runways={VNKT_RW} />

        </main>
    );
}