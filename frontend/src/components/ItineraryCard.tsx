"use client";

import type { Trip } from "@/types";
import {
    ArrowPathIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import api from "@/utils/api";
import { Route, Sparkles } from "lucide-react";

interface ItineraryCardProps {
    trip: Trip | null;
    onTripUpdated: () => Promise<void>;
}

export default function ItineraryCard({
    trip,
    onTripUpdated,
}: ItineraryCardProps) {
    if (!trip) {
        return (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
                <Route size={28} className="text-slate-600 mb-3" />
                <p className="text-slate-400 font-medium">
                    Select a trip to view itinerary
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Choose a trip from the library to preview the day-by-day plan.
                </p>
            </div>
        );
    }

    const lastDayNumber = trip?.itinerary?.[trip.itinerary.length - 1]?.dayNumber;

    const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
    const [deletingDay, setDeletingDay] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const [savingActivity, setSavingActivity] = useState(false);
    const [activityForm, setActivityForm] = useState({
        title: "",
        description: "",
        estimatedCost: "",
    });

    const saveActivity = async () => {
        try {
            setSavingActivity(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${trip._id}/activity`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        dayNumber: selectedDay,

                        title:
                            activityForm.title,

                        description:
                            activityForm.description,

                        estimatedCost:
                            Number(
                                activityForm.estimatedCost
                            ),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            const updatedTrip =
                await response.json();
            setShowAddModal(false);

            window.location.reload();



        } catch (error) {
            console.error(error);
        } finally {
            setSavingActivity(false);
        }
    };


    const handleRegenerateDay = async (dayNumber: number) => {
        const confirmed = window.confirm(
            `Regenerate Day ${dayNumber} with AI? This will replace all activities for this day.`
        );

        if (!confirmed) return;

        try {
            setRegeneratingDay(dayNumber);

            await api.patch(
                `/trips/${trip._id}/regenerate-day/${dayNumber}`
            );

            await onTripUpdated();
        } catch (error: any) {
            if (error?.response?.status === 429) {
                alert("AI quota exceeded. Please try again later.");
            } else {
                console.error("Failed to regenerate day", error);
                alert("Failed to regenerate day. Please try again.");
            }
        } finally {
            setRegeneratingDay(null);
        }
    };

    const handleDeleteDay = async (dayNumber: number) => {
        const confirmed = window.confirm(
            `Delete Day ${dayNumber}?`
        );

        if (!confirmed) return;

        try {
            setDeletingDay(dayNumber);

            const updatedItinerary = (trip.itinerary || [])
                .filter((d) => d.dayNumber !== dayNumber)
                .map((d, index) => ({
                    ...d,
                    dayNumber: index + 1,
                }));

            const updatedDurationDays = updatedItinerary.length;

            await api.put(`/trips/${trip._id}`, {
                itinerary: updatedItinerary,
                durationDays: updatedDurationDays,
            });

            await onTripUpdated();
        } catch (error) {
            console.error("Failed to delete day", error);
        } finally {
            setDeletingDay(null);
        }
    };

    return (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
            
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6">
                <div className="h-8 w-8 rounded-lg bg-[#5E7CFF]/15 flex items-center justify-center text-[#5E7CFF]">
                    <Route size={16} />
                </div>
                <h2 className="text-lg font-semibold text-white">
                    {trip.destination} Itinerary
                </h2>
                <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                    {trip.itinerary?.length || 0} Days
                </span>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                {trip.itinerary?.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="group border border-white/[0.06] rounded-2xl p-4 hover:border-white/15 transition-all duration-300 relative"
                    >
                        {/* Day Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="h-7 w-7 rounded-lg bg-[#5E7CFF]/10 text-[#5E7CFF] text-xs font-bold flex items-center justify-center">
                                    {day.dayNumber}
                                </span>
                                <h3 className="text-base font-semibold text-white">
                                    Day {day.dayNumber}
                                </h3>
                            </div>

                            {/* Hover Actions */}
                            <div
                                className="
                        flex items-center gap-2
                        opacity-0
                        group-hover:opacity-100
                        transition-all duration-200
                    "
                            >
                                <button
                                    onClick={() =>
                                        handleRegenerateDay(day.dayNumber)
                                    }
                                    disabled={
                                        regeneratingDay === day.dayNumber
                                    }
                                    className="
                            h-8 w-8
                            flex items-center justify-center
                            rounded-lg
                            bg-[#5E7CFF]/10
                            hover:bg-[#5E7CFF]/20
                            text-[#5E7CFF]
                            transition
                            disabled:opacity-50
                        "
                                    title="Regenerate Day"
                                >
                                    <ArrowPathIcon className={`h-4 w-4 ${regeneratingDay === day.dayNumber ? "animate-spin" : ""}`} />
                                </button>

                                <button
                                     onClick={() =>
                                         handleDeleteDay(day.dayNumber)
                                     }
                                     disabled={
                                         deletingDay === day.dayNumber
                                    }
                                    className="
                            h-8 w-8
                            flex items-center justify-center
                            rounded-lg
                            bg-red-500/10
                            hover:bg-red-500/20
                            text-red-400
                            transition
                        "
                                    title="Delete Day"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Activities */}
                        <div className="space-y-2">
                            {day.activities?.map((activity, index) => (
                                <div
                                    key={index}
                                    className="bg-black/20 rounded-xl p-3 border border-white/[0.04]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-white font-medium text-sm">
                                            {activity.title}
                                        </p>

                                        {activity.estimatedCost !== undefined && (
                                            <span className="
                                    text-xs
                                    text-emerald-300
                                    bg-emerald-500/10
                                    border border-emerald-500/20
                                    px-2 py-0.5
                                    rounded-full
                                    whitespace-nowrap
                                    font-medium
                                ">
                                                ₹{activity.estimatedCost}
                                            </span>
                                        )}
                                    </div>

                                    {activity.description && (
                                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                            {activity.description}
                                        </p>
                                    )}

                                </div>

                            ))}
                        </div>
                        {/* ONLY LAST DAY CAN ADD ACTIVITY */}
                        {
                            day.dayNumber === lastDayNumber && (
                                <div className="mt-3">
                                    <button
                                        onClick={() => {
                                            setSelectedDay(day.dayNumber);
                                            setActivityForm({
                                                title: "",
                                                description: "",
                                                estimatedCost: "",
                                            });

                                            setShowAddModal(true);
                                        }}
                                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            bg-white/[0.04]
                            hover:bg-white/[0.08]
                            border border-white/10
                            text-xs
                            font-semibold
                            text-slate-300
                            transition-all
                        "
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        Add Activity
                                    </button>
                                </div>
                            )
                        }

                    </div>
                ))}
            </div>

            {/* Add Activity Modal */}
            {showAddModal && (
                <div className="
        fixed inset-0 z-[1000]
        flex items-center justify-center
        bg-black/70
        backdrop-blur-md
        p-4
    ">
                    <div className="
            w-full max-w-lg
            rounded-[28px]
            border border-white/10
            bg-[#111214]
            p-8
            shadow-2xl
        ">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
                                <Sparkles size={16} />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                                Add Activity
                            </h2>
                        </div>

                        <div className="space-y-4">

                            <input
                                type="text"
                                placeholder="Activity title"
                                value={activityForm.title}
                                onChange={(e) =>
                                    setActivityForm(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                className="
                        w-full
                        rounded-[20px]
                        bg-white/[0.03]
                        border border-white/10
                        px-4 py-3.5
                        text-white text-sm
                        placeholder:text-slate-500
                        focus:outline-none focus:border-[#5E7CFF]
                        transition
                    "
                            />

                            <input
                                type="number"
                                placeholder="Estimated Cost (₹)"
                                value={
                                    activityForm.estimatedCost
                                }
                                onChange={(e) =>
                                    setActivityForm(prev => ({
                                        ...prev,
                                        estimatedCost:
                                            e.target.value,
                                    }))
                                }
                                className="
                        w-full
                        rounded-[20px]
                        bg-white/[0.03]
                        border border-white/10
                        px-4 py-3.5
                        text-white text-sm
                        placeholder:text-slate-500
                        focus:outline-none focus:border-[#5E7CFF]
                        transition
                    "
                            />

                            <textarea
                                rows={4}
                                placeholder="Description (optional)"
                                value={
                                    activityForm.description
                                }
                                onChange={(e) =>
                                    setActivityForm(prev => ({
                                        ...prev,
                                        description:
                                            e.target.value,
                                    }))
                                }
                                className="
                        w-full
                        rounded-[20px]
                        bg-white/[0.03]
                        border border-white/10
                        px-4 py-3.5
                        text-white text-sm
                        placeholder:text-slate-500
                        focus:outline-none focus:border-[#5E7CFF]
                        transition resize-none
                    "
                            />

                        </div>

                        <div className="
                flex justify-end gap-3
                mt-6
            ">
                            <button
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                                className="
                        px-5 py-2.5
                        rounded-[16px]
                        border border-white/10
                        text-slate-300 text-sm font-semibold
                        hover:bg-white/5
                        transition
                    "
                            >
                                Cancel
                            </button>

                            <button
                                disabled={savingActivity}
                                onClick={saveActivity}
                                className="
                        px-5 py-2.5
                        rounded-[16px]
                        bg-[#5E7CFF] hover:bg-[#4d6de6]
                        text-white text-sm font-semibold
                        shadow-[0_4px_15px_rgba(94,124,255,0.25)]
                        disabled:opacity-50
                        transition
                    "
                            >
                                {savingActivity
                                    ? "Saving..."
                                    : "Save Activity"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}