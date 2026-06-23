'use client';

import "../app/globals.css";

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

import { Manrope } from "next/font/google";
import { motion } from "framer-motion";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function HomePage() {
  return (
    <main
      className={`${manrope.className} min-h-screen bg-[#070B14] text-white`}
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
      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-24 text-center -mt-25">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-slate-800 rounded-full px-4 py-2 text-sm text-slate-400 mb-10"
        >
          <Brain className="h-4 w-4" />
          AI Powered Travel Planning
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="
      max-w-5xl
      mx-auto
      text-5xl
      md:text-7xl
      font-medium
      tracking-[-0.04em]
      leading-[1]
      text-white
      font-ravex
    "
        >
          Plan Your Next

          <span className="block mt-3 text-blue-400 font-semibold">
            Adventure With AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="
      max-w-2xl
      mx-auto
      mt-8
      text-lg
      leading-8
      text-slate-400
    "
        >
          Generate personalized itineraries, estimate travel budgets,
          discover hotels, organize activities, and prepare smart
          packing lists powered by Gemini AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Link
            href="/register"
            className="
        bg-blue-600
        hover:bg-blue-500
        px-8
        py-4
        rounded-2xl
        font-medium
        flex
        items-center
        justify-center
        gap-2
        shadow-lg
        shadow-blue-500/20
      "
          >
            Start Planning
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/login"
            className="
        border
        border-slate-700
        hover:border-slate-600
        hover:bg-slate-900
        px-8
        py-4
        rounded-2xl
        font-medium
      "
          >
            Open Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="
      mt-14
      flex
      flex-wrap
      justify-center
      gap-8
      text-sm
      text-slate-500
    "
        >
          <span>✦ Personalized Itineraries</span>
          <span>✦ Smart Budget Planning</span>
          <span>✦ AI Packing Assistant</span>
        </motion.div>

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
            <div className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-blue-500/10
              border
              border-blue-500/20
              text-blue-400
              text-xl
              font-semibold
              flex
              items-center
              justify-center
              mb-5
              ">
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
            <div className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-blue-500/10
              border
              border-blue-500/20
              text-blue-400
              text-xl
              font-semibold
              flex
              items-center
              justify-center
              mb-5
              ">
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
            <div className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-blue-500/10
              border
              border-blue-500/20
              text-blue-400
              text-xl
              font-semibold
              flex
              items-center
              justify-center
              mb-5
              ">
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
