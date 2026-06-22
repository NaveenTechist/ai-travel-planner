"use client";

export default function Sidebar() {
    const items = [
        "Overview",
        "My Trips",
        "Packing",
        "AI Planner",
        "Favorites",
        "Settings",
    ];

    return (
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-black/30 backdrop-blur-xl">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-[#4169E1]" />

                    <div>
                        <h2 className="font-semibold text-white">
                            Trao AI
                        </h2>

                        <p className="text-xs text-zinc-500">
                            Travel Planner
                        </p>
                    </div>
                </div>
            </div>

            <nav className="px-4 space-y-2">
                {items.map((item, index) => (
                    <button
                        key={item}
                        className={`w-full rounded-2xl px-4 py-3 text-left transition ${index === 0
                            ? "bg-[#4169E1]/15 text-white border border-[#4169E1]/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </nav>
        </aside>
    );
}