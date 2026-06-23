"use client";

import { Wallet, Home, UtensilsCrossed, Ticket, Bus } from "lucide-react";

interface BudgetCardProps {
    budget: {
        accommodation?: number;
        food?: number;
        activities?: number;
        transport?: number;
        total?: number;
    };
}

export default function BudgetCard({
    budget,
}: BudgetCardProps) {
    const total = budget?.total || 0;

    const categories = [
        {
            label: "Accommodation",
            value: budget?.accommodation || 0,
            icon: Home,
            color: "text-[#5E7CFF]",
            bg: "bg-[#5E7CFF]/10",
        },
        {
            label: "Food & Dining",
            value: budget?.food || 0,
            icon: UtensilsCrossed,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
        },
        {
            label: "Activities",
            value: budget?.activities || 0,
            icon: Ticket,
            color: "text-[#8B5CF6]",
            bg: "bg-[#8B5CF6]/10",
        },
        {
            label: "Transport",
            value: budget?.transport || 0,
            icon: Bus,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <Wallet size={16} />
                </div>
                <h2 className="text-lg font-semibold text-white">
                    Budget Breakdown
                </h2>
            </div>

            <div className="space-y-3">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;

                    return (
                        <div
                            key={cat.label}
                            className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3"
                        >
                            <div className={`h-8 w-8 rounded-lg ${cat.bg} flex items-center justify-center ${cat.color}`}>
                                <Icon size={14} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300">{cat.label}</span>
                                    <span className="text-white font-medium">₹{cat.value.toLocaleString()}</span>
                                </div>

                                <div className="mt-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${cat.bg.replace("/10", "/60")}`}
                                        style={{ width: `${pct}%`, background: `currentColor`, opacity: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium">
                    Total Estimated
                </span>
                <span className="text-xl font-bold text-emerald-400">
                    ₹{total.toLocaleString()}
                </span>
            </div>
        </div>
    );
}