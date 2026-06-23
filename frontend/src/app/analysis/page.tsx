// src/app/analysis/page.tsx
"use client";

import { useMemo } from "react";
import { useDashboard } from "@/components/navigation/DashboardLayout";
import DashboardLayout from "@/components/navigation/DashboardLayout";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart as RechartsPieChart, 
    Pie, 
    Cell,
    AreaChart,
    Area
} from "recharts";
import { 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    Calendar, 
    Wallet, 
    Activity, 
    Backpack 
} from "lucide-react";

export default function AnalysisPage() {
    return (
        <DashboardLayout>
            <AnalysisContent />
        </DashboardLayout>
    );
}

function AnalysisContent() {
    const { trips } = useDashboard();

    // 1. Core Totals
    const totalTrips = trips.length;

    const totalBudget = useMemo(() => {
        return trips.reduce((sum, t) => sum + (t.estimatedBudget?.total || 0), 0);
    }, [trips]);

    const averageBudget = useMemo(() => {
        if (totalTrips === 0) return 0;
        return Math.round(totalBudget / totalTrips);
    }, [trips, totalTrips, totalBudget]);

    const averageDuration = useMemo(() => {
        if (totalTrips === 0) return 0;
        const totalDays = trips.reduce((sum, t) => sum + (t.durationDays || 0), 0);
        return (totalDays / totalTrips).toFixed(1);
    }, [trips, totalTrips]);

    // 2. Budget Comparisons Chart Data
    const budgetChartData = useMemo(() => {
        return trips.map(trip => ({
            name: trip.destination.split(",")[0],
            Budget: trip.estimatedBudget?.total || 0,
            Days: trip.durationDays || 0
        })).reverse();
    }, [trips]);

    // 3. Top Interests Data
    const interestsChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        trips.forEach(trip => {
            trip.interests?.forEach(interest => {
                const formatted = interest.trim();
                if (formatted) {
                    counts[formatted] = (counts[formatted] || 0) + 1;
                }
            });
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [trips]);

    // 4. Global Packing Completion
    const packingPieData = useMemo(() => {
        let totalItems = 0;
        let checkedItems = 0;

        trips.forEach(trip => {
            if (!trip.packingList) return;
            const list: any = trip.packingList;
            if (Array.isArray(list)) {
                totalItems += list.length;
                checkedItems += list.filter((i: any) => i.checked || i.isPacked).length;
            } else {
                const doc = list.crucialDocuments || [];
                const equip = list.activityEquipment || [];
                const wear = list.climateWear || [];
                totalItems += doc.length + equip.length + wear.length;
                checkedItems += doc.filter((i: any) => i.checked).length + 
                               equip.filter((i: any) => i.checked).length + 
                               wear.filter((i: any) => i.checked).length;
            }
        });

        const packed = checkedItems;
        const remaining = totalItems - checkedItems;

        return [
            { name: "Packed", value: packed },
            { name: "Remaining", value: remaining === 0 && packed === 0 ? 1 : remaining }
        ];
    }, [trips]);

    const packingCompletionRate = useMemo(() => {
        const packed = packingPieData[0].value;
        const total = packed + (packingPieData[1].value === 1 && packed === 0 ? 0 : packingPieData[1].value);
        return total > 0 ? Math.round((packed / total) * 100) : 0;
    }, [packingPieData]);

    const COLORS = ["#22C55E", "#8B5CF6"];

    return (
        <div className="flex-1 px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full space-y-8">
            
            {/* Header */}
            <div className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#5E7CFF]/15 border border-[#5E7CFF]/20 flex items-center justify-center text-[#5E7CFF]">
                        <BarChart3 size={16} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
                        Insights
                    </p>
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white font-ravex">
                    Travel Analytics & Trends
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Visual insights of your destinations, budget patterns, travel duration and packing completion.
                </p>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                
                <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Trips</span>
                        <TrendingUp size={16} className="text-[#5E7CFF]" />
                    </div>
                    <h2 className="text-3xl font-bold mt-4 text-white">{totalTrips}</h2>
                    <p className="text-xs text-slate-500 mt-2">Saved in your library</p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Budget</span>
                        <Wallet size={16} className="text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold mt-4 text-white">₹{(totalBudget/100000).toFixed(2)}L</h2>
                    <p className="text-xs text-slate-500 mt-2">Across all trips</p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Budget</span>
                        <Activity size={16} className="text-[#8B5CF6]" />
                    </div>
                    <h2 className="text-3xl font-bold mt-4 text-white">₹{averageBudget.toLocaleString()}</h2>
                    <p className="text-xs text-slate-500 mt-2">Per trip average cost</p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Duration</span>
                        <Calendar size={16} className="text-amber-400" />
                    </div>
                    <h2 className="text-3xl font-bold mt-4 text-white">{averageDuration} <span className="text-lg font-normal text-slate-400">Days</span></h2>
                    <p className="text-xs text-slate-500 mt-2">Average trip length</p>
                </div>

            </div>

            {trips.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-2">
                    
                    {/* Budget Trends Chart */}
                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
                        <div>
                            <h3 className="font-semibold text-lg text-white">Trip Budgets & Lengths</h3>
                            <p className="text-xs text-slate-400 mt-1">Comparison of budget (rupees) against duration (days)</p>
                        </div>
                        <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={budgetChartData}>
                                    <defs>
                                        <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#5E7CFF" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#5E7CFF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: "#111214", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                                        labelStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
                                    />
                                    <Area type="monotone" dataKey="Budget" stroke="#5E7CFF" strokeWidth={2} fillOpacity={1} fill="url(#colorBudget)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Interests Frequency Chart */}
                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
                        <div>
                            <h3 className="font-semibold text-lg text-white">Top Travel Interests</h3>
                            <p className="text-xs text-slate-400 mt-1">Frequency of interest tags selected across travel plans</p>
                        </div>
                        <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={interestsChartData}>
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                                    <Tooltip 
                                        cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                                        contentStyle={{ backgroundColor: "#111214", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                                    />
                                    <Bar dataKey="value" name="Frequency" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Packing Completion Rate */}
                    <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 flex flex-col shadow-xl min-h-[350px]">
                        <div>
                            <h3 className="font-semibold text-lg text-white">Global Packing Checklist Completion</h3>
                            <p className="text-xs text-slate-400 mt-1">Accumulated packed vs remaining checkable items across all trips</p>
                        </div>
                        
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-6 mt-6">
                            <div className="h-48 w-48 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={packingPieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {packingPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-extrabold text-white">{packingCompletionRate}%</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Packed</span>
                                </div>
                            </div>

                            <div className="space-y-4 min-w-[150px]">
                                <div className="flex items-center gap-3">
                                    <div className="h-3.5 w-3.5 rounded bg-emerald-500" />
                                    <div>
                                        <p className="text-xs text-slate-400">Packed Items</p>
                                        <p className="text-sm font-semibold text-white">{packingPieData[0].value} Items</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-3.5 w-3.5 rounded bg-[#8B5CF6]" />
                                    <div>
                                        <p className="text-xs text-slate-400">Remaining Items</p>
                                        <p className="text-sm font-semibold text-white">
                                            {packingPieData[1].value === 1 && packingPieData[0].value === 0 ? 0 : packingPieData[1].value} Items
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Empty block or additional visual info */}
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-center items-center text-center shadow-xl min-h-[350px]">
                        <div className="h-12 w-12 rounded-2xl bg-[#5E7CFF]/10 flex items-center justify-center text-[#5E7CFF] mb-4">
                            <Backpack size={24} />
                        </div>
                        <h3 className="font-semibold text-lg text-white">Smart Travel Assistant Advice</h3>
                        <p className="text-sm text-slate-400 max-w-sm mt-2">
                            Based on your packing and budget analysis, you tend to plan {averageDuration} day trips with a median budget tier. Keeping packing lists structured helps reduce travel anxiety!
                        </p>
                    </div>

                </div>
            ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 p-16 text-center">
                    <BarChart3 size={40} className="mx-auto text-slate-600 mb-4 animate-bounce" />
                    <h3 className="text-lg font-semibold text-slate-400">No Analytics Available Yet</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Once you create AI trip plans, we will render your travel patterns and spending habits in this workspace.
                    </p>
                </div>
            )}

        </div>
    );
}