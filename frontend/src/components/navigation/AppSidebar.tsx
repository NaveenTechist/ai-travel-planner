// src/components/navigation/AppSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
    LayoutDashboard,
    MapPinned,
    Backpack,
    PlusCircle,
    User,
    BarChart3,
    LogOut,
    Search,
    Settings,
    HelpCircle,
    Globe
} from "lucide-react";
import { useDashboard } from "./DashboardLayout";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Trips",
        href: "/trips",
        icon: MapPinned,
    },
    {
        label: "Packs",
        href: "/packs",
        icon: Backpack,
    },
    {
        label: "Create",
        href: "/create",
        icon: PlusCircle,
    },
    {
        label: "Analysis",
        href: "/analysis",
        icon: BarChart3,
    },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const { setCommandOpen, handleLogout } = useDashboard();
    const [profileOpen, setProfileOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <aside
            className="
            hidden lg:flex
            fixed left-0 top-0
            h-screen
            w-[270px]
            flex-col
            border-r border-white/10
            bg-[#111214]
            rounded-r-[32px]
            z-[90]
            "
        >
            {/* Header Brand */}
            <div className="px-7 pt-9 pb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#5E7CFF] to-[#8B5CF6] flex items-center justify-center border border-white/15 shadow-[0_4px_20px_rgba(94,124,255,0.3)]">
                    <Globe className="h-5 w-5 text-white animate-pulse" />
                </div>

                <div>
                    <h1 className="font-ravex text-xl font-bold tracking-wider text-white">
                        Travel OS
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
                        AI Travel Planner
                    </p>
                </div>
            </div>

            {/* Search Input Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={() => setCommandOpen(true)}
                    className="
                        w-full flex items-center justify-between 
                        rounded-2xl border border-white/10 bg-white/[0.03] 
                        px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/20
                        transition duration-300 text-left
                    "
                >
                    <div className="flex items-center gap-3">
                        <Search size={16} className="text-slate-400" />
                        <span className="text-sm">Search trips...</span>
                    </div>

                    <kbd className="rounded-[8px] bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-500 font-mono">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                relative flex items-center gap-3
                                rounded-2xl px-4 py-3.5 text-sm font-medium
                                transition-all duration-300 group
                                ${active
                                    ? "bg-[#5E7CFF]/15 border border-[#5E7CFF]/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                    : "text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.03]"
                                }
                            `}
                        >
                            {/* Blue glow indicator bar on active item */}
                            {active && (
                                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#5E7CFF] rounded-r-full" />
                            )}
                            <Icon size={18} className={`${active ? "text-[#5E7CFF]" : "text-slate-400 group-hover:text-slate-200"} transition`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Section Footer */}
            <div className="p-4 border-t border-white/5 relative" ref={popoverRef}>
                
                {/* Profile Popup Menu Popover */}
                {profileOpen && (
                    <div className="absolute bottom-20 left-4 right-4 z-[999] rounded-[24px] border border-white/10 bg-[#111214]/95 backdrop-blur-xl p-2 shadow-2xl animate-[fadeIn_0.15s_ease-out]">
                        <Link
                            href="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
                        >
                            <User size={16} className="text-[#5E7CFF]" />
                            Profile
                        </Link>
                        <Link
                            href="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
                        >
                            <Settings size={16} className="text-[#8B5CF6]" />
                            Settings
                        </Link>
                        <button
                            onClick={() => {
                                setProfileOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition text-left"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}

                {/* Profile Selector Trigger */}
                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="
                        w-full flex items-center gap-3 rounded-[20px] 
                        bg-white/[0.03] border border-white/5 p-3 text-left
                        hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300
                    "
                >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#5E7CFF] to-[#8B5CF6] flex items-center justify-center font-semibold text-white border border-white/10 shadow-lg">
                        NK
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            Naveen Kumar
                        </p>
                        <p className="text-[10px] text-slate-400 tracking-wider">
                            View Profile
                        </p>
                    </div>

                    <div className="flex flex-col gap-0.5 pr-1 opacity-60">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    </div>
                </button>
            </div>
        </aside>
    );
}