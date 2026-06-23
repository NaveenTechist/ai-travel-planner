// src/app/trips/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/components/navigation/DashboardLayout";
import DashboardLayout from "@/components/navigation/DashboardLayout";
import ItineraryCard from "@/components/ItineraryCard";
import PackingList from "@/components/PackingList";
import BudgetCard from "@/components/BudgetCard";
import { getCountryFlag } from "@/utils/flag";
import { 
    MapPinned, 
    Search, 
    Plus, 
    CalendarDays, 
    Wallet, 
    Trash2, 
    ArrowRight, 
    Check,
    ChevronRight,
    Sparkles
} from "lucide-react";
import Link from "next/link";

export default function TripsPage() {
    return (
        <DashboardLayout>
            <TripsContent />
        </DashboardLayout>
    );
}

function TripsContent() {
    const { 
        trips, 
        selectedTripId, 
        setSelectedTripId, 
        fetchTrips 
    } = useDashboard();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [viewingTripId, setViewingTripId] = useState<string | null>(null);

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
            if (viewingTripId === tripId) {
                setViewingTripId(null);
            }
            await fetchTrips();
        } catch (error) {
            console.error("Failed to delete trip", error);
        }
    };

    // Filter trips by search query
    const filteredTrips = useMemo(() => {
        return trips.filter(trip => 
            `${trip.destination} ${trip.budgetTier} ${trip.interests?.join(" ")}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    }, [trips, searchQuery]);

    // Trip details of the currently inspected trip
    const viewingTrip = useMemo(() => {
        return trips.find(t => t._id === viewingTripId) || null;
    }, [trips, viewingTripId]);

    return (
        <div className="flex-1 px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white font-ravex">
                        My Trips Library
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Browse, manage, search and inspect your generated travel plans.
                    </p>
                </div>

                <Link
                    href="/create"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#5E7CFF] hover:bg-[#4d6de6] px-5 py-3 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(94,124,255,0.3)] transition"
                >
                    <Plus size={16} />
                    <span>Create Trip</span>
                </Link>
            </div>

            {/* Search Input Card */}
            <div className="rounded-[20px] border border-white/10 bg-white/[0.02] px-4 py-3 flex items-center gap-3">
                <Search size={18} className="text-slate-500" />
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search trips by destination, budget, interests..."
                    className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none text-sm"
                />
            </div>

            {/* Trips List Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredTrips.map((trip) => {
                    const isWorkspaceActive = selectedTripId === trip._id;
                    const isInspecting = viewingTripId === trip._id;

                    return (
                        <div
                            key={trip._id}
                            className={`
                                rounded-[28px] border p-6 flex flex-col justify-between transition-all duration-300 relative group
                                ${isInspecting 
                                    ? "border-[#8B5CF6] bg-[#8B5CF6]/5" 
                                    : isWorkspaceActive 
                                        ? "border-[#5E7CFF] bg-[#5E7CFF]/5" 
                                        : "border-white/10 bg-[#111214] hover:border-white/20"
                                }
                            `}
                        >
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-xl text-white truncate flex items-center gap-2">
                                            {trip.destination} {getCountryFlag(trip.destination)}
                                        </h3>
                                        
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                            <CalendarDays size={12} />
                                            <span>{trip.durationDays} Days Duration</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isWorkspaceActive && (
                                            <span className="rounded-full bg-[#5E7CFF]/20 border border-[#5E7CFF]/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#5E7CFF] uppercase">
                                                Workspace
                                            </span>
                                        )}
                                        
                                        <button
                                            onClick={() => handleDeleteTrip(trip._id)}
                                            className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition duration-200"
                                            title="Delete Trip"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                    <div className="flex items-center gap-1.5">
                                        <Wallet size={12} className="text-slate-500" />
                                        <span>Budget: <strong className="text-slate-300 font-medium">{trip.budgetTier}</strong></span>
                                    </div>
                                    <div>
                                        <span>₹{(trip.estimatedBudget?.total || 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {trip.interests?.map((interest, idx) => (
                                        <span key={idx} className="rounded-full bg-white/[0.04] border border-white/10 px-2.5 py-0.5 text-[10px] text-slate-400">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                                <button
                                    onClick={() => {
                                        setViewingTripId(isInspecting ? null : trip._id);
                                    }}
                                    className={`
                                        flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold text-center transition flex items-center justify-center gap-1.5
                                        ${isInspecting 
                                            ? "bg-[#8B5CF6] text-white" 
                                            : "bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08]"
                                        }
                                    `}
                                >
                                    <span>{isInspecting ? "Close Details" : "Open Trip Details"}</span>
                                    <ChevronRight size={14} className={isInspecting ? "rotate-90 transition-transform" : ""} />
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedTripId(trip._id);
                                    }}
                                    disabled={isWorkspaceActive}
                                    className={`
                                        rounded-xl px-4 py-2.5 text-xs font-semibold transition
                                        ${isWorkspaceActive
                                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                                            : "bg-[#5E7CFF] hover:bg-[#4d6de6] text-white"
                                        }
                                    `}
                                >
                                    {isWorkspaceActive ? <Check size={14} /> : "Set Active"}
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filteredTrips.length === 0 && (
                    <div className="rounded-[28px] border border-dashed border-white/10 p-12 text-center col-span-full">
                        <MapPinned size={36} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400 font-medium">No trips matched your search filter.</p>
                        <p className="text-xs text-slate-500 mt-1">Try refining the query or create a new trip plan.</p>
                    </div>
                )}
            </div>

            {/* Inspections panel showing ONLY the selected/opened trip details */}
            {viewingTrip && (
                <div className="border-t border-white/5 pt-8 space-y-6 animate-[fadeIn_0.25s_ease-out]">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                            <Sparkles size={16} />
                        </div>
                        <h2 className="text-2xl font-bold tracking-wide">
                            Inspecting Trip: {viewingTrip.destination}
                        </h2>
                    </div>

                    <div className="grid gap-8 xl:grid-cols-[1fr_400px] items-start">
                        
                        <div>
                            <ItineraryCard trip={viewingTrip} onTripUpdated={fetchTrips} />
                        </div>

                        <div className="space-y-8">
                            <PackingList 
                                tripId={viewingTrip._id} 
                                packingList={viewingTrip.packingList || []} 
                                onUpdate={fetchTrips} 
                            />
                            
                            <BudgetCard budget={viewingTrip.estimatedBudget} />
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}