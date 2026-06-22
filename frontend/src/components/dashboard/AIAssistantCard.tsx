"use client";

export default function AIAssistantCard() {
    return (
        <div className="rounded-3xl border border-white/5 bg-[#111111] p-6">
            <p className="text-zinc-500">
                AI Assistant
            </p>

            <h3 className="mt-3 text-xl text-white">
                Rain expected on Day 2
            </h3>

            <p className="mt-3 text-zinc-400">
                Update packing list with rain gear.
            </p>

            <button className="mt-5 rounded-2xl bg-[#4169E1] px-4 py-2 text-white">
                Update Packing
            </button>
        </div>
    );
}