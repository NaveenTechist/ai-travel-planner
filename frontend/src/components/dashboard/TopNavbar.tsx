"use client";

export default function TopNavbar() {
    return (
        <header className="sticky top-0 z-30 border-b border-white/5 bg-black/20 backdrop-blur-2xl">
            <div className="flex items-center justify-between px-6 py-4">
                <h1 className="text-white text-xl font-semibold">
                    Dashboard
                </h1>

                <div className="flex items-center gap-3">
                    <input
                        placeholder="Search trips..."
                        className="hidden md:block w-72 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-white outline-none"
                    />

                    <div className="h-10 w-10 rounded-full bg-zinc-700" />
                </div>
            </div>
        </header>
    );
}