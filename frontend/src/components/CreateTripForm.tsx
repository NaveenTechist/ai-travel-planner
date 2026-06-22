"use client";

import { useState } from "react";

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

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

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
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
            <h2 className="text-xl font-bold">
                Create New Trip
            </h2>

            <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700"
            />

            <input
                type="number"
                min={1}
                placeholder="Duration (Days)"
                value={durationDays}
                onChange={(e) =>
                    setDurationDays(Number(e.target.value))
                }
                required
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700"
            />

            <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700"
            >
                <option value="Low">Low Budget</option>
                <option value="Medium">Medium Budget</option>
                <option value="High">High Budget</option>
            </select>

            <input
                type="text"
                placeholder="Interests (food, hiking, museums)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold"
            >
                {loading ? "Generating..." : "Generate Trip"}
            </button>
        </form>
    );
}