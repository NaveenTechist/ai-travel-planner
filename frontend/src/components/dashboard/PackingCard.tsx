"use client";

export default function PackingCard() {
    return (
        <div className="rounded-3xl border border-white/5 bg-[#111111] p-6">
            <p className="text-zinc-500">
                Packing Progress
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
                12 / 20
            </h3>

            <div className="mt-5 h-3 rounded-full bg-zinc-800">
                <div className="h-3 w-[60%] rounded-full bg-[#4169E1]" />
            </div>
        </div>
    );
}