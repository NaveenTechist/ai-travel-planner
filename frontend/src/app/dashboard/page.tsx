"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import type { Trip } from "@/types";
import CreateTripForm from "@/components/CreateTripForm";
import ItineraryCard from "@/components/ItineraryCard";
import PackingList from "@/components/PackingList";

const navItems = [
    { label: "Dashboard", active: true },
    { label: "Trips", active: false },
    { label: "AI Planner", active: false },
    { label: "Packing Assistant", active: false },
    { label: "Security", active: false },
    { label: "Settings", active: false },
];

const systemChecks = [
    { title: "JWT Auth", value: "Protected" },
    { title: "Ownership", value: "Enforced" },
    { title: "AI Validation", value: "Enabled" },
    { title: "ObjectId", value: "Validated" },
];

const workflowStages = [
    "Input Validation",
    "Gemini AI Generation",
    "AI Response Validation",
    "MongoDB Save",
    "Ownership Check",
];

export default function DashboardPage() {
    const router = useRouter();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [showCreateTrip, setShowCreateTrip] = useState(false);

    const selectedTrip = useMemo(
        () => trips.find((trip) => trip._id === selectedTripId) || trips[0] || null,
        [trips, selectedTripId]
    );

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        fetchTrips();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await api.get("/trips");

            const tripsData = Array.isArray(response.data?.data)
                ? response.data.data
                : [];

            setTrips(tripsData);
            if (tripsData.length > 0) {
                setSelectedTripId(tripsData[0]._id);
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
                return;
            }

            console.error("Failed to load trips", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTrips = trips.filter((trip) =>
        `${trip.destination} ${trip.budgetTier} ${trip.durationDays} ${trip.interests?.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );

    const totalTrips = trips.length;
    const totalDays = trips.reduce((sum, trip) => sum + (trip.durationDays || 0), 0);
    const avgBudget =
        trips.length > 0
            ? Math.round(
                trips.reduce((sum, trip) => sum + (trip.estimatedBudget?.total || 0), 0) / trips.length
            )
            : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-slate-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl animate-pulse" />
                    <p className="text-sm tracking-wide text-slate-400">Loading your travel workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0B1120] text-white">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="hidden lg:flex w-[280px] flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl">
                    <div className="p-6 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-[#4169E1] shadow-[0_0_30px_rgba(65,105,225,0.35)]" />
                            <div>
                                <h1 className="text-lg font-semibold leading-none">AI Travel Planner</h1>
                                <p className="text-xs text-slate-400 mt-1">Secure multi-user workspace</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <p className="px-3 pb-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Main Menu
                        </p>

                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    className={[
                                        "w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left transition",
                                        item.active
                                            ? "bg-[#4169E1]/14 border border-[#4169E1]/35 text-white shadow-[0_0_0_1px_rgba(65,105,225,0.08)]"
                                            : "bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.04]",
                                    ].join(" ")}
                                >
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span
                                        className={[
                                            "h-2 w-2 rounded-full",
                                            item.active ? "bg-[#4169E1]" : "bg-white/15",
                                        ].join(" ")}
                                    />
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main */}
                <section className="flex-1">
                    {/* Top bar */}
                    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0B1120]/85 backdrop-blur-2xl">
                        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
                            <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Dashboard</p>
                                <h2 className="mt-1 text-xl lg:text-2xl font-semibold text-white">
                                    Travel Command Center
                                </h2>
                            </div>

                            <div className="hidden md:flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search trips..."
                                        className="w-[320px] rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl focus:border-[#4169E1]/60"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 text-sm">
                                        ⌘K
                                    </div>
                                </div>

                                <button className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-300 hover:text-white hover:border-[#4169E1]/40 transition">
                                    Export
                                </button>

                                <button
                                    onClick={() => setShowCreateTrip(true)}
                                    className="rounded-2xl bg-[#4169E1] px-4 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(65,105,225,0.25)]"
                                >
                                    New Trip
                                </button>
                            </div>
                        </div>
                    </header>

                    {showCreateTrip && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="relative w-full max-w-2xl mx-4">
                                <button
                                    onClick={() => setShowCreateTrip(false)}
                                    className="absolute right-4 top-4 z-10 text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>

                                <CreateTripForm
                                    onTripCreated={async () => {
                                        await fetchTrips();
                                        setShowCreateTrip(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="px-5 py-6 lg:px-8 lg:py-8 space-y-6">
                        {/* Hero / Summary */}
                        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
                            <section className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 lg:p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                                Workspace Overview
                                            </p>
                                            <h3 className="mt-2 text-2xl lg:text-3xl font-semibold text-white">
                                                Your AI travel operations panel
                                            </h3>
                                            <p className="mt-3 max-w-2xl text-sm lg:text-base text-slate-400 leading-7">
                                                Secure trip generation, ownership-validated edits, AI itinerary workflows,
                                                weather-aware packing, and future regeneration tools — all in one focused
                                                dashboard.
                                            </p>
                                        </div>

                                        <div className="hidden md:flex items-center gap-2 rounded-2xl border border-[#4169E1]/20 bg-[#4169E1]/10 px-4 py-3">
                                            <span className="h-2.5 w-2.5 rounded-full bg-[#4169E1]" />
                                            <span className="text-sm text-slate-200">System Ready</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="rounded-3xl border border-white/[0.06] bg-[#0F172A]/70 p-5">
                                            <p className="text-sm text-slate-400">Trips</p>
                                            <p className="mt-3 text-3xl font-semibold text-white">{totalTrips}</p>
                                            <p className="mt-2 text-xs text-slate-500">User-owned documents</p>
                                        </div>

                                        <div className="rounded-3xl border border-white/[0.06] bg-[#0F172A]/70 p-5">
                                            <p className="text-sm text-slate-400">Total Days</p>
                                            <p className="mt-3 text-3xl font-semibold text-white">{totalDays}</p>
                                            <p className="mt-2 text-xs text-slate-500">Across saved itineraries</p>
                                        </div>

                                        <div className="rounded-3xl border border-white/[0.06] bg-[#0F172A]/70 p-5">
                                            <p className="text-sm text-slate-400">Avg Budget</p>
                                            <p className="mt-3 text-3xl font-semibold text-white">
                                                {avgBudget ? `$${avgBudget.toLocaleString()}` : "$0"}
                                            </p>
                                            <p className="mt-2 text-xs text-slate-500">Calculated server-side</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                            Selected Trip
                                        </p>
                                        <h3 className="mt-2 text-2xl font-semibold text-white">
                                            {selectedTrip ? (
                                                <div className="mt-6 space-y-4">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Metric
                                                            label="Destination"
                                                            value={selectedTrip.destination}
                                                        />

                                                        <Metric
                                                            label="Duration"
                                                            value={`${selectedTrip.durationDays} Days`}
                                                        />

                                                        <Metric
                                                            label="Budget"
                                                            value={selectedTrip.budgetTier}
                                                        />

                                                        <Metric
                                                            label="Estimated Cost"
                                                            value={`$${selectedTrip.estimatedBudget?.total || 0}`}
                                                        />
                                                    </div>

                                                    <div className="rounded-3xl border border-white/[0.06] bg-[#0F172A]/70 p-5">
                                                        <p className="text-sm text-slate-400 mb-3">
                                                            Interests
                                                        </p>

                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedTrip.interests?.map((interest) => (
                                                                <span
                                                                    key={interest}
                                                                    className="rounded-full bg-[#4169E1]/10 border border-[#4169E1]/20 px-3 py-1 text-xs text-[#C9D8FF]"
                                                                >
                                                                    {interest}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-8 text-center">
                                                    <p className="text-slate-400">
                                                        Create your first trip
                                                    </p>
                                                </div>
                                            )}
                                        </h3>
                                    </div>
                                </div>

                                {selectedTrip ? (
                                    <div className="mt-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Metric label="Duration" value={`${selectedTrip.durationDays} days`} />
                                            <Metric label="Budget Tier" value={selectedTrip.budgetTier} />
                                            <Metric
                                                label="Budget Total"
                                                value={`$${(selectedTrip.estimatedBudget?.total || 0).toLocaleString()}`}
                                            />
                                            <Metric label="Interests" value={selectedTrip.interests?.length?.toString() || "0"} />
                                        </div>

                                        <div className="rounded-3xl border border-white/[0.06] bg-[#0F172A]/70 p-5">
                                            <p className="text-sm text-slate-400">Interests</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {(selectedTrip.interests || []).map((item) => (
                                                    <span
                                                        key={item}
                                                        className="rounded-full border border-[#4169E1]/20 bg-[#4169E1]/10 px-3 py-1 text-xs text-[#C9D8FF]"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-8 rounded-3xl border border-dashed border-white/[0.10] bg-black/10 p-8 text-center">
                                        <p className="text-lg font-medium text-white">No active trip yet</p>
                                        <p className="mt-2 text-sm text-slate-400">
                                            Create a trip to unlock itinerary editing, packing intelligence, and AI
                                            regeneration.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Lower grid */}
                        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                            {/* Trip list */}
                            <section className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-2xl">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                            Saved Trips
                                        </p>
                                        <h3 className="mt-2 text-xl font-semibold text-white">Trip Library</h3>
                                    </div>

                                    <button className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-[#4169E1]/40 transition">
                                        Filter
                                    </button>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {filteredTrips.length > 0 ? (
                                        filteredTrips.map((trip) => {
                                            const active = selectedTrip?._id === trip._id;

                                            return (
                                                <button
                                                    key={trip._id}
                                                    onClick={() => setSelectedTripId(trip._id)}
                                                    className={[
                                                        "w-full rounded-3xl border p-4 text-left transition",
                                                        active
                                                            ? "border-[#4169E1]/35 bg-[#4169E1]/10 shadow-[0_0_0_1px_rgba(65,105,225,0.10)]"
                                                            : "border-white/[0.06] bg-black/10 hover:border-white/[0.12] hover:bg-white/[0.04]",
                                                    ].join(" ")}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="text-lg font-semibold text-white">
                                                                {trip.destination}
                                                            </p>

                                                            <p className="text-sm text-slate-400">
                                                                {trip.durationDays} Days
                                                            </p>

                                                            <p className="text-sm text-slate-400">
                                                                {trip.budgetTier} Budget
                                                            </p>
                                                        </div>

                                                        <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300">
                                                            {trip.interests?.length || 0} interests
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {(trip.interests || []).slice(0, 3).map((interest) => (
                                                            <span
                                                                key={interest}
                                                                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400"
                                                            >
                                                                {interest}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="rounded-3xl border border-dashed border-white/[0.10] bg-black/10 p-6 text-center">
                                            <p className="text-sm text-slate-400">No trips found</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-2xl">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                    Travel Summary
                                </p>

                                <h3 className="mt-2 text-xl font-semibold text-white">
                                    Your Travel Insights
                                </h3>

                                <div className="mt-5 grid gap-4">
                                    <div className="rounded-2xl border border-white/[0.06] p-4">
                                        ✈️ {totalTrips} Trips Planned
                                    </div>

                                    <div className="rounded-2xl border border-white/[0.06] p-4">
                                        🗓 {totalDays} Travel Days
                                    </div>

                                    <div className="rounded-2xl border border-white/[0.06] p-4">
                                        💰 Average Budget ${avgBudget}
                                    </div>
                                </div>
                            </div>
                            <ItineraryCard trip={selectedTrip} />
                            {selectedTrip && (
                                <PackingList
                                    tripId={selectedTrip._id}
                                    packingList={selectedTrip.packingList || []}
                                    onUpdate={fetchTrips}
                                />
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-3xl border border-white/[0.06] bg-[#0F172A]/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-semibold text-white leading-6">{value}</p>
        </div>
    );
}