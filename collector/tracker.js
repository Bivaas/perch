export const AIRPORTS = [
    {
        code: "VNKT", lat:27.6966, lon: 85.3591, elevFt: 4390, radius: 60, nearNm: 13, lowMarginFt: 7000, savePositions: true
    },

    {
        code: "OMDB", lat: 25.2528, lon: 55.3644, elevFt: 62, radius: 30, nearNm: 3, lowMarginFt: 2000, savePositions: false,
    }
];

export const GAP_MINUTES = 10;

// shortest distance
function distanceNm (lat, lon, airport) {

    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat - airport.lat);
    const dLon = toRad(lon - airport.lon);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(airport.lat)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2;

    return 2 * 3440.065 * Math.asin(Math.sqrt(a));
}

export function classify(f, airport) {

    const near = f.minDist <= airport.nearNm;
    const low = f.minAlt <= airport.elevFt + airport.lowMarginFt;

    if (!near || !low ) return "other";

    if (f.firstAlt === 0 && f.lastAlt === 0) return "on ground";

    if (f.lastDist < f.firstDist ) return "arrival";

    if (f.lastDist > f.firstDist) return "departure";

    return "unknown";
}


export function addRow(current, row, airport) {

    const flight = current[row.hex];

    const gap = flight === undefined ? Infinity : new Date(row.time) - new Date(flight.end);

    const tookOff = flight !== undefined && flight.lastAlt === 0 && typeof row.alt === "number";


    if (gap > GAP_MINUTES * 60 * 1000 || tookOff) {

        current[row.hex] = {

            hex: row.hex,
            callsign: row.flight?.trim(),
            start: row.time,
            end: row.time,
            points: 1,
            minAlt: Infinity,
            minDist: Infinity,
            firstAlt: undefined,
            lastAlt: undefined,
            firstDist: undefined,
            lastDist: undefined,
        };

    } else {

        flight.end = row.time;
        flight.points += 1;
        flight.callsign ??= row.flight?.trim();
    }

    const f = current[row.hex];
    const alt = row.alt === "ground" ? 0 : row.alt;

    if (alt !== undefined) {

        f.minAlt = Math.min(f.minAlt, alt);
        f.firstAlt ??= alt;
        f.lastAlt = alt;
    }

    if (row.lat !== undefined) {

        const d = distanceNm(row.lat, row.lon, airport);
        const rounded = Math.round(d * 10) / 10;
        f.minDist = Math.min(f.minDist, rounded);
        f.firstDist ??= rounded;
        f.lastDist = rounded;
    }

    if (f !== flight) return flight;
}
