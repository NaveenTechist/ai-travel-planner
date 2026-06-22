"use client";

import type { Trip } from "@/types";

interface ItineraryCardProps {
    trip: Trip | null;
}

export default function ItineraryCard({
    trip,
}: ItineraryCardProps) {
    if (!trip) {
        return (
            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6">
                <p className="text-slate-400">
                    Select a trip to view itinerary
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">
                {trip.destination} Itinerary
            </h2>

            <div className="space-y-6">
                {trip.itinerary?.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="border border-white/[0.06] rounded-2xl p-4"
                    >
                        <h3 className="text-lg font-semibold text-white mb-3">
                            Day {day.dayNumber}
                        </h3>

                        <div className="space-y-2">
                            {day.activities?.map((activity, index) => (
                                <div
                                    key={index}
                                    className="bg-black/10 rounded-xl p-3"
                                >
                                    <p className="text-white font-medium">
                                        {activity.title}
                                    </p>

                                    {activity.description && (
                                        <p className="text-sm text-slate-400 mt-1">
                                            {activity.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}