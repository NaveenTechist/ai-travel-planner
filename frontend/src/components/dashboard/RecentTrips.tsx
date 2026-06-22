"use client";

import { Trip } from "@/types";

interface Props {
    trips: Trip[];
}

export default function RecentTrips({
    trips,
}: Props) {
    return (
        <div className="rounded-[32px] border border-white/5 bg-[#111111] p-6">
            <h3 className="text-white text-xl font-semibold">
                Recent Trips
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {trips.map((trip) => (
                    <div
                        key={trip._id}
                        className="rounded-3xl border border-white/5 p-4"
                    >
                        <h4 className="text-white font-medium">
                            {trip.destination}
                        </h4>

                        <p className="mt-2 text-sm text-zinc-500">
                            {trip.durationDays} Days
                        </p>

                        <span className="mt-3 inline-block rounded-full bg-[#4169E1]/10 px-3 py-1 text-xs text-[#8DB4FF]">
                            {trip.budgetTier}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}