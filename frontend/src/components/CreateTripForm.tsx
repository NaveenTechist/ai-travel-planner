// src/components/CreateTripForm.tsx
"use client";

import { useState } from "react";
import {
    MapPinned,
    CalendarDays,
    Wallet,
    Heart,
    Sparkles,
    Loader2
} from "lucide-react";

interface CreateTripFormProps {
    onTripCreated: () => Promise<void>;
}

export default function CreateTripForm({
    onTripCreated,
}: CreateTripFormProps) {
    const [destination, setDestination] = useState("");
    const [durationDays, setDurationDays] = useState(3);
    const [budgetTier, setBudgetTier] = useState("Medium");
    const [interests, setInterests] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            setError("");

            if (durationDays < 1) {
                setError("Please enter at least 1 day");
                setLoading(false);
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/trips/generate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        destination,
                        durationDays,
                        interests: interests
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        budgetTier,
                    }),
                }
            );

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to generate trip");
            }

            await onTripCreated();

            setDestination("");
            setDurationDays(3);
            setBudgetTier("Medium");
            setInterests("");
        } catch (error: any) {
            console.error(error);
            setError(error.message || "AI Trip generation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/10 bg-[#111214] p-8 shadow-2xl relative"
        >
            {loading && (
                <div className="absolute inset-0 bg-[#070B14]/80 backdrop-blur-sm rounded-[28px] z-50 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-10 w-10 text-[#5E7CFF] animate-spin" />
                    <p className="text-sm font-semibold text-white">AI is building your dream itinerary...</p>
                    <p className="text-xs text-slate-400">This might take a minute.</p>
                </div>
            )}

            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-[#5E7CFF] h-4 w-4 animate-pulse" />
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
                        Travel OS Engine
                    </p>
                </div>
                <h2 className="mt-2 text-2xl font-bold text-white tracking-tight">
                    New AI Trip Plan
                </h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                        <MapPinned size={16} className="text-[#5E7CFF]" />
                        Destination
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Tokyo, Japan or Paris, France"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                        className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-4.5 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-[#5E7CFF] focus:bg-white/[0.05]"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                            <CalendarDays size={16} className="text-[#8B5CF6]" />
                            Duration (Days)
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={30}
                            placeholder="7"
                            value={durationDays}
                            onChange={(e) => setDurationDays(Number(e.target.value))}
                            required
                            className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-4.5 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-[#5E7CFF] focus:bg-white/[0.05]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                            <Wallet size={16} className="text-emerald-400" />
                            Budget Tier
                        </label>
                        <select
                            value={budgetTier}
                            onChange={(e) => setBudgetTier(e.target.value)}
                            className="w-full rounded-[24px] border border-white/10 bg-[#111214] px-4.5 py-3.5 text-white outline-none transition focus:border-[#5E7CFF]"
                        >
                            <option className="bg-[#111214]" value="Low">
                                Low Budget
                            </option>
                            <option className="bg-[#111214]" value="Medium">
                                Medium Budget
                            </option>
                            <option className="bg-[#111214]" value="High">
                                High Budget
                            </option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Heart size={16} className="text-pink-400" />
                        Interests
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Food, Hiking, Museums, Shopping (comma separated)"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-4.5 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-[#5E7CFF] focus:bg-white/[0.05]"
                    />
                </div>

                {error && (
                    <div className="rounded-[20px] border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full rounded-[16px] bg-[#5E7CFF] hover:bg-[#4d6de6] py-4 font-semibold text-white transition-all duration-300 
                        shadow-[0_4px_20px_rgba(94,124,255,0.35)] disabled:cursor-not-allowed disabled:opacity-60
                    "
                >
                    Generate Trip Details
                </button>
            </div>
        </form>
    );
}