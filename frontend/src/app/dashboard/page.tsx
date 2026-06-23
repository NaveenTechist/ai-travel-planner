"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import type { Trip } from "@/types";
import CreateTripForm from "@/components/CreateTripForm";
import ItineraryCard from "@/components/ItineraryCard";
import PackingList from "@/components/PackingList";
import BudgetCard from "@/components/BudgetCard";
import { GrLocationPin } from "react-icons/gr";
import {
    Globe,
    Search,
    ArrowRight,
    MapPinned,
    Plus,
    LayoutDashboard,
    CalendarDays,
    Wallet,
    Heart,
    Library,
    Route,
    Backpack,
    PieChart,
    Brain,
    Trash2
} from "lucide-react";

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
    const [commandOpen, setCommandOpen] = useState(false);


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

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleDeleteTrip = async (tripId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip? This cannot be undone."
        );
        if (!confirmed) return;

        try {
            await api.delete(`/trips/${tripId}`);

            if (selectedTripId === tripId) {
                setSelectedTripId(null);
            }

            await fetchTrips();
        } catch (error) {
            console.error("Failed to delete trip", error);
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
        return (<div className="min-h-screen bg-[#0B1120] flex items-center justify-center">

            <div className="flex flex-col items-center">

                {/* Logo */}
                <div className="relative">

                    <div className="absolute inset-0 bg-[#5E7CFF]/20 blur-3xl rounded-full" />

                    <div className="relative h-20 w-20 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center justify-center">
                        <Globe className="h-9 w-9 text-[#5E7CFF] animate-pulse" />
                    </div>

                </div>

                {/* Brand */}
                <h2 className="mt-8 text-2xl font-semibold text-white">
                    Travel OS
                </h2>

                <p className="mt-2 text-slate-400 text-sm text-center max-w-sm">
                    Creating your personalized itinerary, finding hotels,
                    estimating budgets and preparing your journey.
                </p>

                {/* Progress Bar */}
                <div className="mt-8 w-72 h-1 bg-white/5 rounded-full overflow-hidden">

                    <div
                        className={`
                            h - full
                            w-1 /3
                    bg-gradient-to-r
                    from-[#5E7CFF]
                    to-blue-400
                    animate-[loading_2s_ease-in-out_infinite]
                          `}
                    />

                </div>

                {/* Steps */}
                <div className="mt-6 flex gap-3 text-xs text-slate-500">

                    <span>Planning</span>
                    <span>•</span>
                    <span>Optimizing</span>
                    <span>•</span>
                    <span>Generating</span>
                </div>

            </div>

            <style jsx global>{`
    @keyframes loading {
      0% {
        transform: translateX(-120%);
      }
      100% {
        transform: translateX(350%);
      }
    }
  `}</style>

        </div>
        );
    }


    return (
        <main className="min-h-screen bg-[#070B14] text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5E7CFF]/20 blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
            </div>

            <section className="relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070B14]/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-[1600px] px-5 lg:px-8">
                        <div className="flex h-20 items-center justify-between">

                            <div className="flex items-center gap-3">
                                <Globe className="h-6 w-6 text-[#5E7CFF]" />
                                <div>
                                    <h1 className="font-ravex text-xl tracking-wide text-white">
                                        Travel OS
                                    </h1>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center gap-3">

                                <div
                                    onClick={() => setCommandOpen(true)}
                                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <Search size={18} />
                                        <span className="text-slate-400">
                                            Search trips...
                                        </span>
                                    </div>

                                    <kbd className="rounded bg-white/5 px-2 py-1 text-xs">
                                        ⌘K
                                    </kbd>
                                </div>
                                {commandOpen && (
                                    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md">

                                        <div className="mx-auto mt-24 max-w-2xl">

                                            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111214] shadow-2xl">

                                                <div className="border-b border-white/10 p-4">

                                                    <input
                                                        autoFocus
                                                        value={query}
                                                        onChange={(e) => setQuery(e.target.value)}
                                                        placeholder="Search trips..."
                                                        className="w-full bg-transparent text-lg outline-none"
                                                    />

                                                </div>

                                                <div className="max-h-[500px] overflow-y-auto p-3">

                                                    {filteredTrips.map((trip) => (

                                                        <button
                                                            key={trip._id}
                                                            onClick={() => {
                                                                setSelectedTripId(trip._id);
                                                                setCommandOpen(false);
                                                            }}
                                                            className="mb-2 flex w-full items-center justify-between rounded-2xl border border-white/5 p-4 hover:border-[#5E7CFF]/30 hover:bg-[#5E7CFF]/10"
                                                        >
                                                            <div>

                                                                <div className="flex items-center gap-2">
                                                                    <GrLocationPin
                                                                        size={16}
                                                                        className="text-red-500 text-lg"
                                                                    />

                                                                    <h4 className="font-semibold">
                                                                        {trip.destination}
                                                                    </h4>
                                                                </div>

                                                                <p className="text-sm text-slate-400">
                                                                    {trip.durationDays} Days • {trip.budgetTier}
                                                                </p>

                                                            </div>

                                                            <ArrowRight size={18} />

                                                        </button>

                                                    ))}

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )}

                                <button
                                    onClick={() => setShowCreateTrip(true)}
                                    className="flex items-center gap-2 rounded-lg bg-[#5E7CFF] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_40px_rgba(139,92,246,0.4)] transition hover:scale-[1.02]"
                                >
                                    <span>New Trip</span>
                                    <Plus size={16} />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Modal */}
                {showCreateTrip && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
                        <div className="relative w-full max-w-2xl px-4">
                            <button
                                onClick={() => setShowCreateTrip(false)}
                                className="absolute right-6 top-4 z-20 text-slate-400 hover:text-white"
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

                <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">

                    {/* HERO */}
                    <section className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-white/[0.04] p-8 backdrop-blur-2xl">

                        <div className="absolute inset-0 bg-gradient-to-br from-[#5E7CFF]/15 via-transparent to-cyan-500/10" />

                        <div className="relative">

                            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                                <div className="max-w-3xl">

                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                        Active Workspace
                                    </p>

                                    <h2 className="mt-4 text-4xl font-bold leading-tight lg:text-6xl">
                                        {selectedTrip
                                            ? selectedTrip.destination
                                            : "Plan your next adventure"}
                                    </h2>

                                    <p className="mt-4 max-w-2xl text-slate-300">
                                        AI-generated itineraries, weather-aware packing,
                                        dynamic trip editing and intelligent budgeting in one place.
                                    </p>

                                    {selectedTrip && (
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                                                <CalendarDays size={16} />
                                                <span>{selectedTrip.durationDays} Days</span>
                                            </div>

                                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                                                <Wallet size={16} />
                                                <span>{selectedTrip.budgetTier}</span>
                                            </div>

                                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                                                <Heart size={16} />
                                                <span>{selectedTrip.interests?.length || 0} Interests</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 lg:w-[420px]">

                                    <div className="rounded-3xl border border-white/[0.08] bg-black/20 p-5">
                                        <p className="text-xs uppercase tracking-wider text-slate-500">
                                            Trips
                                        </p>

                                        <h3 className="mt-3 text-4xl font-bold">
                                            {totalTrips}
                                        </h3>
                                    </div>

                                    <div className="rounded-3xl border border-white/[0.08] bg-black/20 p-5">
                                        <p className="text-xs uppercase tracking-wider text-slate-500">
                                            Days
                                        </p>

                                        <h3 className="mt-3 text-4xl font-bold">
                                            {totalDays}
                                        </h3>
                                    </div>

                                    <div className="rounded-3xl border border-white/[0.08] bg-black/20 p-5 col-span-2">
                                        <p className="text-xs uppercase tracking-wider text-slate-500">
                                            Average Budget
                                        </p>

                                        <h3 className="mt-3 text-3xl font-bold">
                                            ₹{avgBudget.toLocaleString()}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* TRIP STATUS */}
                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

                        <section className="rounded-[32px] border border-white/[0.08] bg-[#111214] p-6">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                        Selected Trip
                                    </p>

                                    <div className="flex items-center gap-2 mt-3">
                                        <LayoutDashboard className="h-6 w-6 text-[#5E7CFF]" />
                                        <h3 className="mt-2 text-2xl font-semibold">
                                            Overview
                                        </h3>
                                    </div>
                                </div>

                                <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs text-emerald-400">
                                    Ready
                                </div>
                            </div>

                            {selectedTrip ? (
                                <div className="mt-6 grid gap-4 md:grid-cols-2">

                                    <Metric
                                        label="Destination"
                                        value={selectedTrip.destination}
                                    />

                                    <Metric
                                        label="Duration"
                                        value={`${selectedTrip.durationDays} Days`}
                                    />

                                    <Metric
                                        label="Budget Tier"
                                        value={selectedTrip.budgetTier}
                                    />

                                    <Metric
                                        label="Estimated Cost"
                                        value={`₹${(
                                            selectedTrip.estimatedBudget?.total || 0
                                        ).toLocaleString()
                                            } `}
                                    />
                                </div>
                            ) : null}
                        </section>
                        <section className="rounded-[32px] border border-white/[0.08] bg-[#111214] p-6">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                Trip Readiness
                            </p>

                            <div className="flex items-center gap-2 mt-3">
                                <Brain className="h-7 w-7 text-[#5E7CFF]" />
                                <h3 className="mt-2 text-2xl font-semibold">
                                    AI Status
                                </h3>
                            </div>

                            <div className="mt-6 space-y-4">

                                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] p-4">
                                    <span>Itinerary Generated</span>
                                    <span className="text-emerald-400">✓</span>
                                </div>

                                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] p-4">
                                    <span>Budget Estimated</span>
                                    <span className="text-emerald-400">✓</span>
                                </div>

                                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] p-4">
                                    <span>Packing Assistant</span>
                                    <span className="text-cyan-400">
                                        {(selectedTrip?.packingList?.length ?? 0)} Items
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] p-4">
                                    <span>AI Ready</span>
                                    <span className="text-[#5E7CFF]">
                                        Active
                                    </span>
                                </div>

                            </div>
                        </section>

                    </div>

                    {/* Main Grid */}

                    <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">

                        {/* Trip Library */}

                        <section className="rounded-[32px] border border-white/[0.08] bg-[#111214] p-6">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                        Saved Trips
                                    </p>

                                    <div className="flex items-center gap-2 mt-3">
                                        <Library className="h-7 w-7 text-[#5E7CFF]" />
                                        <h3 className="text-2xl font-semibold">Library</h3>
                                    </div>
                                </div>

                                <div className="rounded-full bg-[#5E7CFF]/10 px-3 py-1 text-xs text-[#5E7CFF]">
                                    {filteredTrips.length}
                                </div>

                            </div>

                            <div className="mt-6 space-y-3">

                                {filteredTrips.length > 0 ? (
                                    filteredTrips.map((trip) => {

                                        const active =
                                            selectedTrip?._id === trip._id;

                                        return (
                                            <div
                                                key={trip._id}
                                                onClick={() =>
                                                    setSelectedTripId(trip._id)
                                                }
                                                className={[
                                                    "group w-full rounded-3xl border p-5 text-left cursor-pointer transition-all duration-300",
                                                    active
                                                        ? "border-[#5E7CFF]/40 bg-[#5E7CFF]/10"
                                                        : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]",
                                                ].join(" ")}
                                            >

                                                <div className="flex items-start justify-between">

                                                    <div>

                                                        <h4 className="text-lg font-semibold">
                                                            {trip.destination}
                                                        </h4>

                                                        <p className="mt-1 text-sm text-slate-400">
                                                            {trip.durationDays} Days
                                                        </p>

                                                        <p className="text-sm text-slate-500">
                                                            {trip.budgetTier} Budget
                                                        </p>

                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="rounded-full bg-white/5 px-3 py-1 text-xs">
                                                            {trip.interests?.length || 0}
                                                        </div>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTrip(trip._id);
                                                            }}
                                                            className="h-8 w-8 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition opacity-0 group-hover:opacity-100"
                                                            title="Delete Trip"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">

                                                    {(trip.interests || [])
                                                        .slice(0, 3)
                                                        .map((interest) => (
                                                            <span
                                                                key={interest}
                                                                className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300"
                                                            >
                                                                {interest}
                                                            </span>
                                                        ))}

                                                </div>

                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-white/[0.08] p-8 text-center">
                                        <p className="text-slate-400">
                                            No trips found
                                        </p>
                                    </div>
                                )}

                            </div>
                        </section>

                        {/* Workspace */}

                        <div className="space-y-6">

                            <section className="rounded-[32px] border border-white/[0.08] bg-[#111214] p-6">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                            AI Itinerary
                                        </p>

                                        <div className="flex items-center gap-2 mt-3">
                                            <Route className="h-7 w-7 text-[#5E7CFF]" />
                                            <h3 className="text-2xl font-semibold">Travel Timeline</h3>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-6">
                                    <ItineraryCard trip={selectedTrip} onTripUpdated={fetchTrips} />
                                </div>

                            </section>

                            {selectedTrip && (
                                <section className="rounded-[32px] border border-white/[0.08] bg-[#111214] p-6">

                                    <div className="mb-5">
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                            Packing Assistant
                                        </p>

                                        <div className="flex items-center gap-2 mt-3">
                                            <Backpack className="h-7 w-7 text-[#5E7CFF]" />
                                            <h3 className="text-2xl font-semibold">Weather Aware Packing</h3>
                                        </div>
                                    </div>

                                    <PackingList
                                        tripId={selectedTrip._id}
                                        packingList={
                                            selectedTrip.packingList || []
                                        }
                                        onUpdate={fetchTrips}
                                    />

                                </section>
                            )}

                            {selectedTrip && (
                                <section className="rounded-[32px] border border-white/[0.08] bg-[#111214] p-6">

                                    <div className="mb-5">
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                            Budget Intelligence
                                        </p>

                                        <div className="flex items-center gap-2 mt-3">
                                            <PieChart className="h-7 w-7 text-[#5E7CFF]" />
                                            <h3 className="text-2xl font-semibold">Cost Breakdown</h3>
                                        </div>
                                    </div>

                                    <BudgetCard
                                        budget={selectedTrip.estimatedBudget}
                                    />

                                </section>
                            )}

                        </div>

                    </div>

                </div>
            </section>
        </main>
    );

    function Metric({ label, value }: { label: string; value: string }) {
        return (
            <div className="rounded-3xl border border-white/[0.06] bg-[#0F172A]/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white leading-6">{value}</p>
            </div>
        );
    }
}