"use client";

import type { Trip } from "@/types";
import {
    ArrowPathIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface ItineraryCardProps {
    trip: Trip | null;
}

interface ItineraryCardProps {
    trip: Trip | null;
    onTripUpdated: () => Promise<void>;
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

    const lastDayNumber = trip?.itinerary?.[trip.itinerary.length - 1]?.dayNumber;

    const [regeneratingDay, setRegeneratingDay] = useState(null);
    const [deletingDay, setDeletingDay] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    // const [trips, setTrips] = useState<Trip[]>([]);
    // const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trip);
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

            console.log("Trip User:", trip);
            console.log("Trip User ID:", trip._id);
            console.log("Token:", token);
            console.log("Activity Form:", activityForm);

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


    // const handleRegenerateDay = async (dayNumber) => {
    //     const feedback = prompt(
    //         "How would you like to change this day?"
    //     );

    //     if (!feedback) return;

    //     try {
    //         setRegeneratingDay(dayNumber);

    //         await regenerateDay(
    //             trip._id,
    //             dayNumber,
    //             feedback
    //         );

    //         await refreshTrip();
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setRegeneratingDay(null);
    //     }
    // };

    // const handleDeleteDay = async (dayNumber) => {
    //     const confirmed = window.confirm(
    //         `Delete Day ${ dayNumber } ? `
    //     );

    //     if (!confirmed) return;

    //     try {
    //         setDeletingDay(dayNumber);

    //         await deleteDay(
    //             trip._id,
    //             dayNumber
    //         );

    //         await refreshTrip();
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setDeletingDay(null);
    //     }
    // };

    // const handleAddActivity = (dayNumber) => {
    //     // open modal / drawer
    //     console.log("Add activity to day", dayNumber);
    // };

    return (
        <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">
                {trip.destination} Itinerary
            </h2>

            <div className="space-y-6">
                {trip.itinerary?.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="group border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">
                                Day {day.dayNumber}
                            </h3>

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
                                    // onClick={() =>
                                    //     handleRegenerateDay(day.dayNumber)
                                    // }
                                    // disabled={
                                    //     regeneratingDay === day.dayNumber
                                    // }
                                    className="
                            h-8 w-8
                            flex items-center justify-center
                            rounded-lg
                            bg-indigo-500/10
                            hover:bg-indigo-500/20
                            text-indigo-300
                            transition
                        "
                                    title="Regenerate Day"
                                >
                                    <ArrowPathIcon className="h-4 w-4" />
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
                            text-red-300
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
                                    className="bg-black/10 rounded-xl p-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-white font-medium">
                                            {activity.title}
                                        </p>

                                        {activity.estimatedCost !== undefined && (
                                            <span className="
                                    text-xs
                                    text-emerald-300
                                    bg-emerald-500/10
                                    border border-emerald-500/20
                                    px-2 py-1
                                    rounded-full
                                    whitespace-nowrap
                                ">
                                                ₹{activity.estimatedCost}
                                            </span>
                                        )}
                                    </div>

                                    {activity.description && (
                                        <p className="text-sm text-slate-400 mt-1">
                                            {activity.description}
                                        </p>
                                    )}

                                </div>

                            ))}
                        </div>
                        {/* ONLY LAST DAY CAN ADD ACTIVITY */}
                        {
                            day.dayNumber === lastDayNumber && (
                                <div className="mt-4">
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
                            bg-white/[0.05]
                            hover:bg-white/[0.08]
                            border border-white/[0.08]
                            text-sm
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
            {showAddModal && (
                <div className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60
        backdrop-blur-sm
    ">
                    <div className="
            w-full max-w-lg
            rounded-3xl
            border border-white/10
            bg-[#0f172a]
            p-6
        ">
                        <h2 className="
                text-xl font-semibold text-white
                mb-6
            ">
                            Add Activity
                        </h2>

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
                        rounded-xl
                        bg-black/20
                        border border-white/10
                        px-4 py-3
                        text-white
                    "
                            />

                            <input
                                type="number"
                                placeholder="Estimated Cost"
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
                        rounded-xl
                        bg-black/20
                        border border-white/10
                        px-4 py-3
                        text-white
                    "
                            />

                            <textarea
                                rows={4}
                                placeholder="Description"
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
                        rounded-xl
                        bg-black/20
                        border border-white/10
                        px-4 py-3
                        text-white
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
                        px-4 py-2
                        rounded-xl
                        border border-white/10
                        text-slate-300
                    "
                            >
                                Cancel
                            </button>

                            <button
                                disabled={savingActivity}
                                onClick={saveActivity}
                                className="
                        px-4 py-2
                        rounded-xl
                        bg-indigo-600
                        hover:bg-indigo-500
                        text-white
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