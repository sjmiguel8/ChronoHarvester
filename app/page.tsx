"use client"

import dynamic from "next/dynamic"

// Dynamically import the game component to avoid SSR issues with Three.js
const ChronoHarvester = dynamic(() => import("@/components/chrono-harvester"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Loading Chrono-Harvester 3D</h1>
        <p className="text-xl">Preparing time travel sequence...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <ChronoHarvester />
}
