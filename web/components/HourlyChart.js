"use client";

import { BarChart, Bar, XAxis,YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function HourlyChart({ data }) {

    return (

        <ResponsiveContainer width="100%" height={300}>

            <BarChart data={data}>

                <XAxis dataKey="hour"/>
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="arrivals" fill="#2563eb" />
                <Bar dataKey="departures" fill="#16a34a" />

            </BarChart>

        </ResponsiveContainer>
    )
}