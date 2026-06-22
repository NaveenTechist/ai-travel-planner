"use client";

export default function BudgetCard() {
    return (
        <div className="rounded-3xl border border-white/5 bg-[#111111] p-6">
            <p className="text-zinc-500">
                Budget Overview
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
                $48,700
            </h3>

            <p className="mt-2 text-zinc-400">
                Accommodation, Food,
                Activities & Transport
            </p>
        </div>
    );
}