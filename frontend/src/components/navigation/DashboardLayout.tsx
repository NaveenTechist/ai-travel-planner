// src/components/navigation/DashboardLayout.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import type { Trip } from "@/types";
import { Globe, Search, ArrowRight, LayoutDashboard, MapPinned, Backpack, PlusCircle, BarChart3, User, LogOut, Settings, HelpCircle, Check, X, ShieldAlert } from "lucide-react";
import AppSidebar from "./AppSidebar";
import MobileNav from "./MobileNav";

interface DashboardContextType {
    trips: Trip[];
    selectedTripId: string | null;
    setSelectedTripId: (id: string | null) => void;
    selectedTrip: Trip | null;
    loading: boolean;
    fetchTrips: () => Promise<void>;
    commandOpen: boolean;
    setCommandOpen: (open: boolean) => void;
    handleLogout: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTripId, setSelectedTripIdState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [commandOpen, setCommandOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Read selectedTripId from localStorage
    const setSelectedTripId = (id: string | null) => {
        setSelectedTripIdState(id);
        if (id) {
            localStorage.setItem("selectedTripId", id);
        } else {
            localStorage.removeItem("selectedTripId");
        }
    };

    const fetchTrips = async () => {
        try {
            const response = await api.get("/trips");
            const tripsData = Array.isArray(response.data?.data) ? response.data.data : [];
            setTrips(tripsData);

            // Reconcile selected trip
            const storedId = localStorage.getItem("selectedTripId");
            if (storedId && tripsData.some((t: Trip) => t._id === storedId)) {
                setSelectedTripIdState(storedId);
            } else if (tripsData.length > 0) {
                setSelectedTripId(tripsData[0]._id);
            } else {
                setSelectedTripIdState(null);
            }
        } catch (error: any) {
            console.error("Failed to load trips", error);
            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchTrips();

        // Keyboard shortcut for command palette
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen(open => !open);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const selectedTrip = useMemo(() => {
        return trips.find(t => t._id === selectedTripId) || trips[0] || null;
    }, [trips, selectedTripId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("selectedTripId");
        router.push("/login");
    };

    // Filter command palette options
    const filteredTrips = useMemo(() => {
        if (!searchQuery) return trips;
        return trips.filter(trip =>
            `${trip.destination} ${trip.budgetTier}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    }, [trips, searchQuery]);

    const commandPaletteOptions = useMemo(() => {
        const corePages = [
            { label: "Go to Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { label: "Browse Trips Library", href: "/trips", icon: MapPinned },
            { label: "Manage Packing Packs", href: "/packs", icon: Backpack },
            { label: "Create AI Trip Plan", href: "/create", icon: PlusCircle },
            { label: "View Travel Analysis", href: "/analysis", icon: BarChart3 },
            { label: "View Profile", href: "/profile", icon: User }
        ];

        if (!searchQuery) return corePages;
        return corePages.filter(p => p.label.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#5E7CFF]/20 blur-3xl rounded-full glow-bg" />
                        <div className="relative h-20 w-20 -mb-8  flex items-center justify-center">
                            <Globe className="h-9 w-9 text-[#5E7CFF] animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                    </div>
                    <h2 className="mt-8 text-2xl font-bold text-white tracking-wide font-ravex">
                        Travel OS
                    </h2>
                    <p className="mt-2 text-slate-400 text-sm text-center max-w-xs px-4">
                        Loading your workspace and travel library...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <DashboardContext.Provider
            value={{
                trips,
                selectedTripId,
                setSelectedTripId,
                selectedTrip,
                loading,
                fetchTrips,
                commandOpen,
                setCommandOpen,
                handleLogout
            }}
        >
            <div className="min-h-screen bg-[#070B14] text-white flex flex-col lg:flex-row relative">

                {/* Desktop Fixed Sidebar */}
                <AppSidebar />

                {/* Main Content Area */}
                <div className="flex-1 w-full lg:pl-[270px] pb-24 lg:pb-8 min-h-screen flex flex-col relative overflow-x-hidden">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#5E7CFF]/5 blur-[140px] pointer-events-none z-0" />
                    <div className="absolute bottom-10 right-0 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none z-0" />

                    <div className="relative z-10 flex-1 flex flex-col">
                        {children}
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileNav />

                {/* Command Palette Modal */}
                {commandOpen && (
                    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-start justify-center p-4 pt-20 md:pt-32">
                        {/* Overlay backdrop closer */}
                        <div className="absolute inset-0" onClick={() => setCommandOpen(false)} />

                        <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111214] shadow-2xl z-10 flex flex-col animate-[fadeIn_0.2s_ease-out]">
                            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                                <Search className="text-slate-400 h-5 w-5" />
                                <input
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search trips, actions, and sections..."
                                    className="w-full bg-transparent text-white text-lg placeholder:text-slate-500 outline-none"
                                />
                                <button
                                    onClick={() => setCommandOpen(false)}
                                    className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto p-3 space-y-4">
                                {/* Navigation Actions */}
                                <div>
                                    <h4 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Quick Actions
                                    </h4>
                                    <div className="mt-1 space-y-1">
                                        {commandPaletteOptions.map((opt) => {
                                            const Icon = opt.icon;
                                            return (
                                                <button
                                                    key={opt.href}
                                                    onClick={() => {
                                                        router.push(opt.href);
                                                        setCommandOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 hover:border-white/10 hover:bg-white/[0.03] text-left transition"
                                                >
                                                    <div className="h-9 w-9 rounded-xl bg-[#5E7CFF]/10 flex items-center justify-center text-[#5E7CFF]">
                                                        <Icon size={18} />
                                                    </div>
                                                    <span className="font-medium text-slate-200">{opt.label}</span>
                                                    <ArrowRight size={16} className="ml-auto text-slate-500" />
                                                </button>
                                            );
                                        })}
                                        {commandPaletteOptions.length === 0 && (
                                            <p className="px-3 py-2 text-sm text-slate-500">No actions match</p>
                                        )}
                                    </div>
                                </div>

                                {/* Trips list */}
                                <div>
                                    <h4 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Trips Library
                                    </h4>
                                    <div className="mt-1 space-y-1">
                                        {filteredTrips.map((trip) => (
                                            <button
                                                key={trip._id}
                                                onClick={() => {
                                                    setSelectedTripId(trip._id);
                                                    setCommandOpen(false);
                                                    router.push("/dashboard");
                                                }}
                                                className="w-full flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 hover:border-white/10 hover:bg-white/[0.03] text-left transition"
                                            >
                                                <div className="h-9 w-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                                                    <MapPinned size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{trip.destination}</p>
                                                    <p className="text-xs text-slate-400">{trip.durationDays} Days • {trip.budgetTier} Budget</p>
                                                </div>
                                                <ArrowRight size={16} className="ml-auto text-slate-500" />
                                            </button>
                                        ))}
                                        {filteredTrips.length === 0 && (
                                            <p className="px-3 py-2 text-sm text-slate-500">No trips match</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/5 bg-black/20 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
                                <span>Tip: Use ↑↓ arrows to navigate, Esc to close</span>
                                <kbd className="rounded bg-white/5 px-2 py-0.5 border border-white/10">ESC</kbd>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardContext.Provider>
    );
}
