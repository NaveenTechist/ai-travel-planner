"use client";

export default function MobileBottomNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/70 backdrop-blur-xl lg:hidden">
            <div className="flex justify-around py-4 text-zinc-400">
                <span>🏠</span>
                <span>🧳</span>
                <span>✨</span>
                <span>🎒</span>
                <span>⚙️</span>
            </div>
        </div>
    );
}