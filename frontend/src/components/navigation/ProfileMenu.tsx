"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    User,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";

export default function ProfileMenu() {
    return (
        <DropdownMenu.Root>

            <DropdownMenu.Trigger asChild>
                <button
                    className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-white/[0.03]
          p-3
          "
                >
                    <div className="h-10 w-10 rounded-full bg-[#5E7CFF]" />

                    <div className="text-left">
                        <p className="text-sm font-medium">
                            Naveen Kumar
                        </p>

                        <p className="text-xs text-slate-400">
                            View Profile
                        </p>
                    </div>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                className="
        w-64
        rounded-3xl
        border
        border-white/10
        bg-[#111214]
        p-2
        shadow-2xl
        "
            >

                <DropdownMenu.Item className="menu-item">
                    <User size={16} />
                    Profile
                </DropdownMenu.Item>

                <DropdownMenu.Item className="menu-item">
                    <BarChart3 size={16} />
                    Analysis
                </DropdownMenu.Item>

                <DropdownMenu.Item className="menu-item">
                    <Settings size={16} />
                    Settings
                </DropdownMenu.Item>

                <DropdownMenu.Item className="menu-item">
                    <HelpCircle size={16} />
                    Help
                </DropdownMenu.Item>

                <DropdownMenu.Item className="menu-item text-red-400">
                    <LogOut size={16} />
                    Logout
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}