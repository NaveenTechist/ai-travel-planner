"use client";

export default function HeroCard() {
    return (
        <div className="rounded-[32px] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-xl">
            <p className="text-zinc-500 text-sm">
                Upcoming Adventure
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
                Tokyo, Japan
            </h2>

            <p className="mt-4 text-zinc-400">
                5 Days • Medium Budget
            </p>

            <button className="mt-8 rounded-2xl bg-[#4169E1] px-5 py-3 text-white">
                Continue Planning
            </button>
        </div>
    );
}