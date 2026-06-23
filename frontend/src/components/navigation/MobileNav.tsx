// src/components/navigation/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    MapPinned,
    Plus,
    Backpack,
    User,
    Settings,
    HelpCircle,
    LogOut,
    X
} from "lucide-react";
import { useDashboard } from "./DashboardLayout";

export default function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { handleLogout } = useDashboard();
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/trips", label: "Trips", icon: MapPinned },
        { href: "/create", label: "Create", icon: Plus, isCenter: true },
        { href: "/packs", label: "Packs", icon: Backpack },
        { label: "Profile", icon: User, isProfileTrigger: true },
    ];

    return (
        <>
            <div
                className="
                    lg:hidden
                    fixed
                    bottom-0
                    left-0
                    right-0
                    z-[100]
                    border-t
                    border-white/10
                    bg-[#070B14]/90
                    backdrop-blur-xl
                    px-2
                    pb-safe-bottom
                "
            >
                <div className="grid grid-cols-5 h-20 relative items-center">
                    {navItems.map((item, idx) => {
                        const Icon = item.icon;

                        if (item.isCenter) {
                            return (
                                <div key={idx} className="relative flex items-center justify-center">
                                    <Link
                                        href={item.href!}
                                        className="
                                            absolute
                                            left-1/2
                                            -translate-x-1/2
                                            -top-7
                                            h-14
                                            w-14
                                            rounded-full
                                            bg-gradient-to-tr
                                            from-[#5E7CFF]
                                            to-[#8B5CF6]
                                            flex
                                            items-center
                                            justify-center
                                            border
                                            border-white/25
                                            shadow-[0_8px_30px_rgba(94,124,255,0.4)]
                                            hover:scale-105
                                            transition-all
                                            duration-200
                                            z-20
                                        "
                                    >
                                        <Icon className="h-7 w-7 text-white" />
                                    </Link>
                                </div>
                            );
                        }

                        if (item.isProfileTrigger) {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setMenuOpen(true)}
                                    className="flex flex-col items-center justify-center gap-1 w-full h-full text-slate-400 hover:text-white"
                                >
                                    <Icon size={20} className={menuOpen ? "text-[#5E7CFF]" : "text-slate-400"} />
                                    <span className="text-[10px] text-slate-400">
                                        Profile
                                    </span>
                                </button>
                            );
                        }

                        const active = pathname === item.href;

                        return (
                            <Link
                                key={idx}
                                href={item.href!}
                                className="flex flex-col items-center justify-center gap-1 w-full h-full"
                            >
                                <Icon
                                    size={20}
                                    className={
                                        active
                                            ? "text-[#5E7CFF]"
                                            : "text-slate-400 hover:text-white"
                                    }
                                />
                                <span
                                    className={`text-[10px] ${
                                        active
                                            ? "text-[#5E7CFF]"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Hamburger / Profile Drawer Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-md flex items-end justify-center lg:hidden animate-[fadeIn_0.2s_ease-out]">
                    <div className="absolute inset-0" onClick={() => setMenuOpen(false)} />
                    
                    <div className="relative w-full bg-[#111214] border-t border-white/10 rounded-t-[32px] p-6 pb-12 z-10 flex flex-col gap-4 animate-[slideUp_0.25s_ease-out]">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#5E7CFF] to-[#8B5CF6] flex items-center justify-center font-bold text-white">
                                    NK
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Naveen Kumar</h3>
                                    <p className="text-xs text-slate-400">naveen@travelos.com</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    router.push("/profile");
                                }}
                                className="w-full flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-4 text-left hover:bg-white/[0.04] transition"
                            >
                                <User size={18} className="text-[#5E7CFF]" />
                                <span className="font-medium text-slate-200">Profile Settings</span>
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    router.push("/profile");
                                }}
                                className="w-full flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-4 text-left hover:bg-white/[0.04] transition"
                            >
                                <Settings size={18} className="text-[#8B5CF6]" />
                                <span className="font-medium text-slate-200">Preferences & Settings</span>
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    alert("Help center is currently offline.");
                                }}
                                className="w-full flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-4 text-left hover:bg-white/[0.04] transition"
                            >
                                <HelpCircle size={18} className="text-[#22C55E]" />
                                <span className="font-medium text-slate-200">Help & Support</span>
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center gap-4 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-4 text-left hover:bg-red-500/20 transition text-red-400"
                            >
                                <LogOut size={18} />
                                <span className="font-semibold">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}