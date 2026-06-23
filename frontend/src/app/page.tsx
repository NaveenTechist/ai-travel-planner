'use client';

import Link from 'next/link';
import {
  Globe,
  Brain,
  Route,
  Wallet,
  Backpack,
  MapPinned,
  ArrowRight
} from 'lucide-react';

import { DM_Serif_Display } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
});

export default function HomePage() {
  return (
    <main
      className={`${dmSerif.className} min-h-screen bg-slate-950 text-white`}
    >
      {/* Background Glow */} <div className="absolute inset-0 overflow-hidden pointer-events-none"> <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[140px] rounded-full" /> </div>


      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-6">

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-blue-600/15 flex items-center justify-center border border-blue-500/20">
            <Globe className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <h1 className="font-bold text-lg">
              Travel OS
            </h1>

            <p className="text-xs text-slate-500">
              AI Travel Planner
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-900 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">

        <div className="inline-flex items-center gap-2 border border-slate-800 rounded-full px-4 py-2 text-sm text-slate-400 mb-8">
          <Brain className="h-4 w-4" />
          AI Powered Travel Planning
        </div>

        <h1
          className={`${dmSerif.className}
  text-6xl md:text-7xl leading-[1.05] tracking-tight`}
        >
          Plan Your Next
          <span className="block text-blue-400">
            Adventure With AI
          </span>
        </h1>

        {/* <h1 className="text-6xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
          Plan your next adventure
          <span className="block text-blue-400">
            in seconds with AI
          </span>
        </h1> */}

        <p className="max-w-3xl mx-auto mt-8 text-xl text-slate-400">
          Generate personalized itineraries, estimate travel budgets,
          discover hotels, organize activities, and prepare smart packing
          lists powered by Gemini AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >
            Start Planning
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/login"
            className="border border-slate-700 hover:bg-slate-900 px-8 py-4 rounded-2xl font-semibold"
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
            <Brain className="h-8 w-8 text-blue-400 mb-4" />

            <h3 className="font-semibold mb-2">
              AI Itineraries
            </h3>

            <p className="text-sm text-slate-400">
              Generate complete day-by-day travel plans instantly.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
            <Wallet className="h-8 w-8 text-blue-400 mb-4" />

            <h3 className="font-semibold mb-2">
              Budget Planning
            </h3>

            <p className="text-sm text-slate-400">
              Estimate accommodation, food, transport and activity costs.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
            <MapPinned className="h-8 w-8 text-blue-400 mb-4" />

            <h3 className="font-semibold mb-2">
              Hotel Discovery
            </h3>

            <p className="text-sm text-slate-400">
              Receive curated hotel recommendations based on your budget.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
            <Backpack className="h-8 w-8 text-blue-400 mb-4" />

            <h3 className="font-semibold mb-2">
              Smart Packing
            </h3>

            <p className="text-sm text-slate-400">
              AI-generated packing lists based on weather and activities.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold text-center mb-14">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              1
            </div>

            <h3 className="font-semibold mb-2">
              Choose Destination
            </h3>

            <p className="text-slate-400 text-sm">
              Enter destination, budget, interests and trip duration.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              2
            </div>

            <h3 className="font-semibold mb-2">
              AI Generates Plan
            </h3>

            <p className="text-slate-400 text-sm">
              Gemini creates personalized itineraries and recommendations.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              3
            </div>

            <h3 className="font-semibold mb-2">
              Customize & Save
            </h3>

            <p className="text-slate-400 text-sm">
              Modify activities, track packing items and manage trips.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">

          <div>
            <h3 className="font-semibold">
              Travel OS
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Intelligent travel planning powered by AI.
            </p>
          </div>

          <div className="text-sm text-slate-500 mt-4 md:mt-0">
            © 2026 Travel OS. Built with Next.js, Express, MongoDB & Gemini AI.
          </div>

        </div>
      </footer>
    </main>


  );
}
