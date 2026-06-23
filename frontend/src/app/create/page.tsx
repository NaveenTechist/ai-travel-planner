// src/app/create/page.tsx
"use client";

import { useDashboard } from "@/components/navigation/DashboardLayout";
import DashboardLayout from "@/components/navigation/DashboardLayout";
import CreateTripForm from "@/components/CreateTripForm";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function CreatePage() {
    return (
        <DashboardLayout>
            <CreateContent />
        </DashboardLayout>
    );
}

function CreateContent() {
    const { fetchTrips } = useDashboard();
    const router = useRouter();

    const handleTripCreated = async () => {
        // Refresh the global trips context
        await fetchTrips();
        // Redirect to dashboard
        router.push("/dashboard");
    };

    return (
        <div className="flex-1 px-4 py-8 md:px-8 max-w-4xl mx-auto w-full space-y-8">
            
            {/* Header */}
            <div className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#5E7CFF]/15 border border-[#5E7CFF]/20 flex items-center justify-center text-[#5E7CFF]">
                        <Sparkles size={16} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
                        AI Trip Planner
                    </p>
                </div>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white font-ravex">
                    Generate Your Next Travel Plan
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Describe your destination, choose a duration, and specify your budget tier. Our model will generate a personalized day-by-day itinerary.
                </p>
            </div>

            {/* Premium Create Form */}
            <div>
                <CreateTripForm onTripCreated={handleTripCreated} />
            </div>

        </div>
    );
}