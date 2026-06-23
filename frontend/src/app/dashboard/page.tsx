// src/app/dashboard/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/navigation/DashboardLayout";
import DashboardLayout from "@/components/navigation/DashboardLayout";
import CreateTripForm from "@/components/CreateTripForm";
import ItineraryCard from "@/components/ItineraryCard";
import PackingList from "@/components/PackingList";
import BudgetCard from "@/components/BudgetCard";
import { getCountryFlag } from "@/utils/flag";
import {
    Globe,
    Search,
    Plus,
    CalendarDays,
    Wallet,
    Heart,
    Library,
    Route,
    Backpack,
    PieChart,
    Brain,
    Trash2,
    Briefcase,
    Compass,
    Sparkles,
    ArrowRight,
    MapPin
} from "lucide-react";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
}

function DashboardContent() {
    const {
        trips,
        selectedTripId,
        setSelectedTripId,
        selectedTrip,
        fetchTrips,
        setCommandOpen,
        handleLogout
    } = useDashboard();

    const [showCreateTrip, setShowCreateTrip] = useState(false);
    const [greeting, setGreeting] = useState("Good Evening");

    // Dynamic greeting based on hour
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    // Delete trip handler
    const handleDeleteTrip = async (tripId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip? This cannot be undone."
        );
        if (!confirmed) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (selectedTripId === tripId) {
                setSelectedTripId(null);
            }
            await fetchTrips();
        } catch (error) {
            console.error("Failed to delete trip", error);
        }
    };

    // Calculate Stats
    const totalTrips = trips.length;

    const uniqueCountries = useMemo(() => {
        const set = new Set<string>();
        trips.forEach(t => {
            const parts = t.destination.split(",");
            const country = parts[parts.length - 1]?.trim().toLowerCase();
            if (country) set.add(country);
        });
        return set.size;
    }, [trips]);

    const totalDays = useMemo(() => {
        return trips.reduce((sum, t) => sum + (t.durationDays || 0), 0);
    }, [trips]);

    const totalBudget = useMemo(() => {
        return trips.reduce((sum, t) => sum + (t.estimatedBudget?.total || 0), 0);
    }, [trips]);

    const formatBudget = (num: number) => {
        if (num >= 100000) {
            return `₹${(num / 100000).toFixed(2)}L`;
        }
        return `₹${num.toLocaleString()}`;
    };

    // Scroll to section helper
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="flex-1 px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full space-y-8">

            {/* Top Navbar Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-ravex">
                        {greeting}, Naveen 👋
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Ready for your next adventure? Manage your plans and itineraries below.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setCommandOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-slate-400 hover:text-white transition"
                    >
                        <Search size={16} />
                        <span className="text-xs hidden sm:inline">Search (⌘K)</span>
                    </button>

                    <button
                        onClick={() => setShowCreateTrip(true)}
                        className="flex items-center gap-2 rounded-xl bg-[#5E7CFF] hover:bg-[#4d6de6] px-5 py-3 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(94,124,255,0.3)] transition"
                    >
                        <Plus size={16} />
                        <span>New Trip</span>
                    </button>
                </div>
            </div>

            {/* Main Cards Row: Hero Trip Cover & Overview Stats */}
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

                {/* Hero Selected Trip Card */}
                <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.02] p-8 min-h-[320px] flex flex-col justify-between group">
                    {/* Fuji Template Background Cover Image with subtle mask */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-500 z-0"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80')`
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/70 to-transparent z-10" />

                    <div className="relative z-20 flex justify-between items-start">
                        <span className="rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 px-3.5 py-1.5 text-xs font-semibold text-[#a78bfa] tracking-wider uppercase">
                            Upcoming Trip
                        </span>

                        {selectedTrip && (
                            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                                Active Workspace
                            </div>
                        )}
                    </div>

                    <div className="relative z-20 mt-12">
                        {selectedTrip ? (
                            <>
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    {selectedTrip.destination} {getCountryFlag(selectedTrip.destination)}
                                </h2>

                                <p className="text-slate-300 text-sm mt-2 flex items-center gap-2">
                                    <CalendarDays size={14} className="text-slate-400" />
                                    <span>{selectedTrip.durationDays} Days • {selectedTrip.budgetTier} Budget</span>
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    {selectedTrip.interests?.map((interest, idx) => (
                                        <span key={idx} className="rounded-full bg-white/[0.04] border border-white/10 px-3 py-1 text-xs text-slate-300">
                                            {interest}
                                        </span>
                                    ))}
                                    {selectedTrip.interests?.length === 0 && (
                                        <span className="text-xs text-slate-500 italic">No interests selected</span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold text-white">No Trips Available</h2>
                                <p className="text-sm text-slate-400 mt-2">Generate an AI-powered travel plan to get started.</p>
                            </div>
                        )}

                        <div className="mt-8 flex gap-3">
                            {selectedTrip && (
                                <button
                                    onClick={() => scrollToSection("active-workspace")}
                                    className="flex items-center gap-2 rounded-xl bg-[#5E7CFF] hover:bg-[#4d6de6] px-5 py-3 text-xs font-bold text-white shadow-lg transition"
                                >
                                    <span>View Itinerary</span>
                                    <ArrowRight size={14} />
                                </button>
                            )}
                            <button
                                onClick={() => setShowCreateTrip(true)}
                                className="flex items-center gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-5 py-3 text-xs font-bold text-slate-300 transition"
                            >
                                <span>Create New</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Overview Statistics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 flex flex-col justify-between shadow-xl">
                        <div className="h-10 w-10 rounded-xl bg-[#5E7CFF]/10 flex items-center justify-center text-[#5E7CFF]">
                            <Briefcase size={20} />
                        </div>
                        <div className="mt-6">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Trips</p>
                            <h3 className="text-3xl font-bold mt-1 text-white">{totalTrips}</h3>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 flex flex-col justify-between shadow-xl">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Globe size={20} />
                        </div>
                        <div className="mt-6">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Countries</p>
                            <h3 className="text-3xl font-bold mt-1 text-white">{uniqueCountries}</h3>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 flex flex-col justify-between shadow-xl">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <CalendarDays size={20} />
                        </div>
                        <div className="mt-6">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Days Traveled</p>
                            <h3 className="text-3xl font-bold mt-1 text-white">{totalDays}</h3>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 flex flex-col justify-between shadow-xl">
                        <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                            <Wallet size={20} />
                        </div>
                        <div className="mt-6">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Budget</p>
                            <h3 className="text-3xl font-bold mt-1 text-white">{formatBudget(totalBudget)}</h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* At A Glance - Scrollable Anchor Links */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white tracking-wide">At A Glance</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

                    <button
                        onClick={() => scrollToSection("itinerary-section")}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left hover:bg-white/[0.05] hover:border-white/20 transition group"
                    >
                        <Route size={18} className="text-[#5E7CFF]" />
                        <h4 className="font-semibold text-white text-sm mt-3">Itinerary</h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <span>View details</span>
                            <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </p>
                    </button>

                    <button
                        onClick={() => scrollToSection("packing-section")}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left hover:bg-white/[0.05] hover:border-white/20 transition group"
                    >
                        <Backpack size={18} className="text-[#8B5CF6]" />
                        <h4 className="font-semibold text-white text-sm mt-3">Packs</h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <span>Check items</span>
                            <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </p>
                    </button>

                    <button
                        onClick={() => scrollToSection("budget-section")}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left hover:bg-white/[0.05] hover:border-white/20 transition group"
                    >
                        <PieChart size={18} className="text-emerald-400" />
                        <h4 className="font-semibold text-white text-sm mt-3">Budget</h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <span>Cost breakdown</span>
                            <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </p>
                    </button>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left group">
                        <Compass size={18} className="text-amber-400" />
                        <h4 className="font-semibold text-white text-sm mt-3">Hotels</h4>
                        <p className="text-xs text-slate-400 mt-1">
                            {selectedTrip?.hotels?.length || 0} Recommendations
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left group">
                        <Globe size={18} className="text-cyan-400" />
                        <h4 className="font-semibold text-white text-sm mt-3">Transport</h4>
                        <p className="text-xs text-slate-400 mt-1">Flights & local route</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left group">
                        <Brain size={18} className="text-pink-400" />
                        <h4 className="font-semibold text-white text-sm mt-3">AI Insights</h4>
                        <p className="text-xs text-slate-400 mt-1">Smart travel tips</p>
                    </div>

                </div>
            </div>

            {/* Recent Trips Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white tracking-wide">Recent Trips</h3>
                    <Link href="/trips" className="text-xs text-[#5E7CFF] hover:underline flex items-center gap-1">
                        <span>View All Trips</span>
                        <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {trips.slice(0, 3).map((trip) => {
                        const isCurrentActive = trip._id === selectedTripId;
                        return (
                            <div
                                key={trip._id}
                                onClick={() => setSelectedTripId(trip._id)}
                                className={`
                                    rounded-[28px] border p-6 text-left cursor-pointer transition-all duration-300 relative group
                                    ${isCurrentActive
                                        ? "border-[#5E7CFF] bg-[#5E7CFF]/5 shadow-[0_4px_25px_rgba(94,124,255,0.15)]"
                                        : "border-white/10 bg-[#111214] hover:border-white/20"
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-lg text-white">
                                            {trip.destination} {getCountryFlag(trip.destination)}
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {trip.durationDays} Days • {trip.budgetTier} Budget
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTrip(trip._id);
                                        }}
                                        className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition duration-200"
                                        title="Delete Trip"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {trip.interests?.slice(0, 3).map((interest, idx) => (
                                        <span key={idx} className="rounded-full bg-white/[0.04] border border-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {trips.length === 0 && (
                        <div className="rounded-[28px] border border-dashed border-white/10 p-12 text-center col-span-full">
                            <p className="text-slate-500">No saved trips found. Create one now!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Workspace / Trip Details Block */}
            {selectedTrip && (
                <div id="active-workspace" className="border-t border-white/5 pt-8 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#5E7CFF]/15 border border-[#5E7CFF]/20 flex items-center justify-center text-[#5E7CFF]">
                            <Compass size={16} />
                        </div>
                        <h2 className="text-2xl font-bold tracking-wide">
                            Trip Workspace: {selectedTrip.destination}
                        </h2>
                    </div>

                    <div className="grid gap-8 xl:grid-cols-[1fr_400px] items-start">

                        {/* Day-by-Day Itinerary timeline */}
                        <div id="itinerary-section" className="scroll-mt-6">
                            <ItineraryCard trip={selectedTrip} onTripUpdated={fetchTrips} />
                        </div>

                        {/* Side panel: Packing & Budget breakdowns */}
                        <div className="space-y-8">
                            <div id="packing-section" className="scroll-mt-6">
                                <PackingList
                                    tripId={selectedTrip._id}
                                    packingList={selectedTrip.packingList || []}
                                    onUpdate={fetchTrips}
                                />
                            </div>

                            <div id="budget-section" className="scroll-mt-6">
                                <BudgetCard budget={selectedTrip.estimatedBudget} />
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Trip Creation Modal Overlay */}
            {showCreateTrip && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="relative w-full max-w-2xl">
                        <button
                            onClick={() => setShowCreateTrip(false)}
                            className="absolute right-6 top-6 z-20 text-slate-400 hover:text-white bg-white/5 border border-white/10 h-8 w-8 rounded-full flex items-center justify-center transition"
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

        </div>
    );
}