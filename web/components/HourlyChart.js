"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const TICK = { fontSize: 12, fill:"#000205"};

export default function HourlyChart({ data }) {

    return (

        <ResponsiveContainer width="100%" height={260}>

            <BarChart data={data}>

                <CartesianGrid vertical={false}  />

                <XAxis dataKey="hour" tick={TICK} tickLine={false} axisLine={false}/>

                <Tooltip cursor={{ fill: "#ffffff" }} />

                <Legend  wrapperStyle={{ fontSize: 17 }} />

                <Bar dataKey="arrivals" fill="#2364f0" radius={[3, 3, 0, 0]} />

                <Bar dataKey="departures" fill="#1bad51" radius={[3, 3, 0, 0]}/>

            </BarChart>

        </ResponsiveContainer>
    )
}