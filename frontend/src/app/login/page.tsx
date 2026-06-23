"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();


        try {
            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", {
                email,
                password,
            });
            console.log(response);

            const { token } = response.data;

            if (!token) {
                throw new Error("Token not received");
            }

            localStorage.setItem("token", token);

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

    return (<main className="relative min-h-screen bg-[#0B1120] overflow-hidden flex items-center justify-center px-6">
        {/* Ambient Glow */} <div className="absolute top-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-[#4169E1]/10 blur-[120px]" /> <div className="absolute bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-[#4169E1]/10 blur-[120px]" />


        {/* Grid Overlay */}
        <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
                backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }}
        />

        {/* Card */}
        <div className="relative w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-[#4169E1]/5 blur-2xl" />

            <div className="relative backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-12 w-12 rounded-2xl bg-[#4169E1] flex items-center justify-center shadow-lg shadow-blue-900/50">
                            <span className="text-white text-lg">
                                ✈
                            </span>
                        </div>

                        <div>
                            <h1 className="text-white font-bold text-xl">
                                AI Travel Planner
                            </h1>

                            <p className="text-slate-500 text-sm">
                                Intelligent trip planning
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white">
                        Welcome back
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Sign in to manage your trips and
                        itineraries.
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4169E1] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full h-12 px-4 pr-12 rounded-xl bg-black/20 border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4169E1] transition"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-[#4169E1] text-white font-semibold hover:bg-[#3b5fd4] transition-all disabled:opacity-50"
                    >
                        {loading
                            ? "Signing In..."
                            : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
                    <p className="text-slate-400 text-sm">
                        Don't have an account?
                    </p>

                    <Link
                        href="/register"
                        className="inline-block mt-2 text-[#4169E1] font-medium hover:text-blue-400 transition"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    </main>


    );
}
