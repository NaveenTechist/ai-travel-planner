"use client";

import { useState } from "react";
import {
    MapPinned,
    CalendarDays,
    Wallet,
    Heart,
    Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

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

            console.log("Submitting Trip:", {
                destination,
                durationDays,
                budgetTier,
                interests: interests
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            });

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
                        budgetTier,
                        interests: interests
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to generate trip");
            }

            await onTripCreated();

            setDestination("");
            setDurationDays(3);
            setBudgetTier("Medium");
            setInterests("");
        } catch (error) {
            console.error(error);
            alert("Trip generation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-white/[0.08] bg-[#111214] p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
        >
            <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    AI Travel Planner
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                    Create New Trip
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                    Generate a personalized itinerary, packing list and budget plan.
                </p>
            </div>

            <div className="space-y-5">

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                        <MapPinned size={16} />
                        Destination
                    </label>

                    <input
                        type="text"
                        placeholder="Tokyo, Japan"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white placeholder:text-slate-500 outline-none transition focus:border-[#5E7CFF] focus:bg-white/[0.05]"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                        <CalendarDays size={16} />
                        Duration (Days)
                    </label>

                    <input
                        type="number"
                        min={1}
                        placeholder="7"
                        value={durationDays}
                        onChange={(e) =>
                            setDurationDays(Number(e.target.value))
                        }
                        required
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white placeholder:text-slate-500 outline-none transition focus:border-[#5E7CFF] focus:bg-white/[0.05]"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Wallet size={16} />
                        Budget Tier
                    </label>

                    <select
                        value={budgetTier}
                        onChange={(e) => setBudgetTier(e.target.value)}
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-[#5E7CFF]"
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

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Heart size={16} />
                        Interests
                    </label>

                    <input
                        type="text"
                        placeholder="Food, Hiking, Museums, Beaches..."
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white placeholder:text-slate-500 outline-none transition focus:border-[#5E7CFF] focus:bg-white/[0.05]"
                    />
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-4 w-full overflow-hidden rounded-2xl bg-[#5E7CFF] py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(94,124,255,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="relative z-10">
                        {loading
                            ? "Generating AI Trip..."
                            : "Generate Trip"}
                    </span>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#5E7CFF] via-[#6F8DFF] to-[#5E7CFF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
            </div>
        </form>
    );
}