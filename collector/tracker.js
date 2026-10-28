export const AIRPORT = {

    code: "VNKT",
    lat: 27.6966,
    lon: 85.3591,
};

export const AP_ELEV = 4390;
export const NEAR_NM = 3;
export const LOW_MARGIN_FT = 2000;
export const GAP_MINUTES = 10;


// shortest distance
export function distanceNm(lat, lon) {

    const toRad = (deg) => (deg * Math.PI) / 100;

    const dLat = toRad(lat - AIRPORT.lat);
    const dLon = toRad(lon - AIRPORT.lon);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(AIRPORT.lat)) * Math.cos(toRad(lat)) * Math.sin(dLon /2) ** 2;

    return 2 * 3440.065 * Math.asin(Math.sqrt(a));
}


export function classify(f) {

    const near = f.minDist <= NEAR_NM;
    const low = f.minAlt <= AP_ELEV + LOW_MARGIN_FT;

    if (!near || !low ) return "overflight";

    if (f.firstAlt > f.lastAlt) return "arrival";

    if (f.firstAlt < f.lastAlt) return "departure";

    if (f.lastAlt === 0) return "on ground";

    return "unknown";
}


export function addRow(current, row) {

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
        };

    } else {

        flight.end = row.time;
        flight.points += 1;
        flight.callsign ??= row.flight?.trim();
    }

    const f = current[row.hex];
    const alt = row.alt === "ground" ? 0 : row.alt;

    if (alt !== undefined) {

        const d = distanceNm(row.lat, row.lon);
        const rounded = Math.round(d * 10) / 10;
        f.minDist = Math.min(f.minDist, rounded)
    }

    if (f !== flight) return flight;
}
