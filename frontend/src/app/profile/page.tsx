// src/app/profile/page.tsx
"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/navigation/DashboardLayout";
import DashboardLayout from "@/components/navigation/DashboardLayout";
import { 
    User, 
    Mail, 
    Calendar, 
    Briefcase, 
    Globe, 
    LogOut,
    ShieldCheck,
    HelpCircle,
    UserCheck,
    Info
} from "lucide-react";

export default function ProfilePage() {
    return (
        <DashboardLayout>
            <ProfileContent />
        </DashboardLayout>
    );
}

function ProfileContent() {
    const { trips, handleLogout } = useDashboard();

    // Stats calculations
    const totalTrips = trips.length;

    const totalDays = useMemo(() => {
        return trips.reduce((sum, t) => sum + (t.durationDays || 0), 0);
    }, [trips]);

    const uniqueCountries = useMemo(() => {
        const set = new Set<string>();
        trips.forEach(t => {
            const parts = t.destination.split(",");
            const country = parts[parts.length - 1]?.trim().toLowerCase();
            if (country) set.add(country);
        });
        return set.size;
    }, [trips]);

    const averageDuration = useMemo(() => {
        if (totalTrips === 0) return 0;
        return (totalDays / totalTrips).toFixed(1);
    }, [trips, totalTrips, totalDays]);

    return (
        <div className="flex-1 px-4 py-8 md:px-8 max-w-4xl mx-auto w-full space-y-8">
            
            {/* Header */}
            <div className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#5E7CFF]/15 border border-[#5E7CFF]/20 flex items-center justify-center text-[#5E7CFF]">
                        <User size={16} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
                        Account Settings
                    </p>
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white font-ravex">
                    My Account Profile
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage your account details, security preferences and inspect your overall travel statistics.
                </p>
            </div>

            {/* Profile Overview Card */}
            <div className="rounded-[28px] border border-white/10 bg-[#111214] p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#5E7CFF] to-[#8B5CF6] flex items-center justify-center text-2xl font-bold text-white border border-white/15 shadow-2xl">
                        NK
                    </div>

                    <div className="flex-1 space-y-1">
                        <h2 className="text-2xl font-bold text-white">Naveen Kumar</h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                                <Mail size={14} className="text-slate-500" />
                                naveen@travelos.com
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 hidden sm:inline" />
                            <span className="flex items-center gap-1">
                                <Calendar size={14} className="text-slate-500" />
                                Member since June 2026
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 sm:pt-0">
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <UserCheck size={12} />
                            Verified User
                        </span>
                    </div>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white tracking-wide">Travel Accomplishments</h3>
                
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-lg">
                        <Briefcase size={16} className="text-[#5E7CFF] mb-3" />
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Trips Created</p>
                        <h4 className="text-2xl font-bold text-white mt-1">{totalTrips}</h4>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-lg">
                        <Calendar size={16} className="text-amber-500 mb-3" />
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Days Traveled</p>
                        <h4 className="text-2xl font-bold text-white mt-1">{totalDays}</h4>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-lg">
                        <Globe size={16} className="text-emerald-400 mb-3" />
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Countries</p>
                        <h4 className="text-2xl font-bold text-white mt-1">{uniqueCountries}</h4>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 shadow-lg">
                        <Info size={16} className="text-[#8B5CF6] mb-3" />
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Avg Duration</p>
                        <h4 className="text-2xl font-bold text-white mt-1">{averageDuration} d</h4>
                    </div>
                </div>
            </div>

            {/* Support & Configuration panel */}
            <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 space-y-4">
                <h3 className="font-semibold text-lg text-white">Security & Preferences</h3>
                
                <div className="divide-y divide-white/5 text-sm">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className="text-[#5E7CFF]" />
                            <div>
                                <p className="font-medium text-slate-200">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-400">Secure your account with an extra verification layer</p>
                            </div>
                        </div>
                        <button className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold transition">
                            Enable
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <HelpCircle size={18} className="text-purple-400" />
                            <div>
                                <p className="font-medium text-slate-200">Help & Support Desk</p>
                                <p className="text-xs text-slate-400">View user documentation, guides, or contact support</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => alert("Support ticket system offline.")}
                            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold transition"
                        >
                            Open Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4">
                <button
                    onClick={handleLogout}
                    className="
                        flex items-center justify-center gap-2.5 rounded-[16px] border border-red-500/20 bg-red-500/10 px-6 py-4 font-semibold text-red-400 hover:bg-red-500/20 transition-all duration-300 w-full sm:w-auto
                    "
                >
                    <LogOut size={16} />
                    <span>Sign Out of Travel OS</span>
                </button>
            </div>

        </div>
    );
}