// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Globe } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { token, user } = response.data;

            if (!token) {
                throw new Error("Token not received");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen bg-[#070B14] overflow-hidden flex items-center justify-center px-6">

            {/* Ambient Glows */}
            <div className="absolute top-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-[#5E7CFF]/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/10 blur-[120px] pointer-events-none" />

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Card wrapper */}
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 rounded-[28px] bg-[#5E7CFF]/5 blur-2xl pointer-events-none" />

                <div className="relative backdrop-blur-2xl bg-[#111214] border border-white/10 rounded-[28px] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#5E7CFF] to-[#8B5CF6] flex items-center justify-center border border-white/15 shadow-lg">
                                <Globe className="h-5 w-5 text-white animate-pulse" />
                            </div>

                            <div>
                                <h1 className="text-white font-ravex font-bold text-lg">
                                    Travel OS
                                </h1>
                                <p className="text-slate-500 text-xs">
                                    Intelligent trip planning
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-1 text-slate-400 text-sm">
                            Sign in to manage your trips and itineraries.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-12 px-4 rounded-[20px] bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#5E7CFF] transition text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 pr-12 rounded-[20px] bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#5E7CFF] transition text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-[16px] border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full h-12 rounded-[16px] bg-[#5E7CFF] hover:bg-[#4d6de6] text-white font-semibold 
                                shadow-[0_4px_15px_rgba(94,124,255,0.25)] transition-all disabled:opacity-50 mt-2
                            "
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-400 text-sm">
                            Don't have an account?
                        </p>

                        <Link
                            href="/register"
                            className="inline-block mt-2 text-[#5E7CFF] font-medium hover:underline transition"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
