// src/app/page.tsx
"use client";

import "../app/globals.css";
import Link from "next/link";
import {
    Globe,
    Brain,
    Route,
    Wallet,
    Backpack,
    MapPinned,
    ArrowRight,
    Sparkles,
    Calendar,
    Compass
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-[#070B14] text-white relative overflow-hidden font-sans">

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#5E7CFF]/10 blur-[130px] rounded-full" />
                <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-[#8B5CF6]/800 opacity-5 bg-[#8B5CF6]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] left-[10%] w-[700px] h-[700px] bg-emerald-500/5 blur-[150px] rounded-full" />
            </div>

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Navbar */}
            <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#5E7CFF] to-[#8B5CF6] flex items-center justify-center border border-white/15 shadow-lg">
                        <Globe className="h-5 w-5 text-white animate-pulse" />
                    </div>

                    <div>
                        <h1 className="font-bold text-lg text-white font-outfit tracking-tight">
                            Travel OS
                        </h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                            AI Travel Planner
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="px-5 py-2.5 rounded-[16px] text-sm font-semibold border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="px-5 py-2.5 rounded-[16px] text-sm font-semibold bg-[#5E7CFF] hover:bg-[#4d6de6] text-white shadow-[0_4px_15px_rgba(94,124,255,0.35)] transition"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">

                {/* AI Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4.5 py-1.5 text-xs font-semibold text-[#a78bfa] tracking-wide mb-8 shadow-inner"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Gemini AI Travel Engine v2.0</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white font-outfit leading-[1.1] max-w-4xl mx-auto"
                >
                    Plan Your Next
                    <span className="block mt-2 bg-gradient-to-r from-[#5E7CFF] via-[#8B5CF6] to-pink-500 bg-clip-text text-transparent">
                        Adventure With AI
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-2xl mx-auto mt-6 text-base md:text-lg leading-relaxed text-slate-400"
                >
                    Generate personalized day-by-day itineraries, estimate travel budgets, organize packing checklists, and preview curated hotels. Powered by artificial intelligence.
                </motion.p>

                {/* Call To Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
                >
                    <Link
                        href="/register"
                        className="
                            bg-[#5E7CFF] hover:bg-[#4d6de6] px-8 py-4 rounded-[16px] font-semibold text-sm
                            flex items-center justify-center gap-2 shadow-lg shadow-[#5E7CFF]/20 transition-all duration-200
                        "
                    >
                        <span>Start Planning</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                        href="/login"
                        className="
                            border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20
                            px-8 py-4 rounded-[16px] font-semibold text-sm transition-all duration-200
                        "
                    >
                        Open Dashboard
                    </Link>
                </motion.div>

                {/* Micro highlights */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-500 uppercase tracking-widest"
                >
                    <span className="flex items-center gap-1.5">✦ Personalization</span>
                    <span className="flex items-center gap-1.5">✦ Budgeting</span>
                    <span className="flex items-center gap-1.5">✦ Packing</span>
                </motion.div>

            </section>

            {/* Features Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-[#5E7CFF]/10 flex items-center justify-center text-[#5E7CFF]">
                            <Brain size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-base font-outfit">AI Itineraries</h3>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                Generate day-wise activities, recommended schedules, and travel points instantly.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-base font-outfit">Budget Estimates</h3>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                Break down trip costs across accommodation, food, activities, and transport sectors.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                            <Compass size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-base font-outfit">Hotel Curation</h3>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                Discover accommodation recommendations tailored directly to your budget level.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Backpack size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-base font-outfit">Smart Packing</h3>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                Generate customized packing list suggestions depending on weather forecasts and interests.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
                <h2 className="text-3xl font-bold text-center text-white font-outfit tracking-tight mb-14">
                    How Travel OS Works
                </h2>

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#5E7CFF]/15 border border-[#5E7CFF]/20 text-[#5E7CFF] text-lg font-bold flex items-center justify-center shadow-inner">
                            1
                        </div>
                        <h3 className="font-semibold text-white font-outfit text-base">Select Inputs</h3>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                            Specify destination, duration days, interests, and budget level preferences.
                        </p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 text-[#8B5CF6] text-lg font-bold flex items-center justify-center shadow-inner">
                            2
                        </div>
                        <h3 className="font-semibold text-white font-outfit text-base">AI Generation</h3>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                            Our AI compiles your schedule, details packing parameters, and projects budgets.
                        </p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-lg font-bold flex items-center justify-center shadow-inner">
                            3
                        </div>
                        <h3 className="font-semibold text-white font-outfit text-base">Track & Save</h3>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                            Inspect your itinerary, check off packing checklist items, and visualize trip stats.
                        </p>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-white font-outfit text-sm">Travel OS</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Intelligent trip planning assistant.
                        </p>
                    </div>

                    <div className="text-xs text-slate-500">
                        © 2026 Travel OS. Built for travel lovers.
                    </div>
                </div>
            </footer>
        </main>
    );
}
