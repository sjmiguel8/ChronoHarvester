"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Era } from "../chrono-harvester"

type GameUIProps = {
  inventory: {
    seeds: Record<string, number>
    crops: Record<string, number>
  }
  temporalEnergy: number
  era: Era
  onReturnToHub: () => void
}

const eraNames = {
  prehistoric: "Prehistoric Era",
  medieval: "Medieval Era",
  future: "Future Era",
}

export default function GameUI({ inventory, temporalEnergy, era, onReturnToHub }: GameUIProps) {
  const [showControls, setShowControls] = useState(true)

  // Hide controls after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Top bar - Era and Energy */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm z-40">
        <div className="text-white">
          <h2 className="font-bold">{eraNames[era]}</h2>
        </div>
        <div className="text-white">
          <span className="text-cyan-400 font-bold">{temporalEnergy}</span> Temporal Energy
        </div>
      </div>

      {/* Bottom bar - Inventory */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm z-40">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h3 className="font-bold mb-1">Seeds:</h3>
            <div className="flex space-x-4">
              <div>
                <span className="text-green-400">{inventory.seeds.prehistoric}</span> Prehistoric
              </div>
              <div>
                <span className="text-yellow-400">{inventory.seeds.medieval}</span> Medieval
              </div>
              <div>
                <span className="text-blue-400">{inventory.seeds.future}</span> Future
              </div>
            </div>
          </div>

          <div className="text-white">
            <h3 className="font-bold mb-1">Harvested:</h3>
            <div className="flex space-x-4">
              <div>
                <span className="text-green-400">{inventory.crops.prehistoric}</span> Prehistoric
              </div>
              <div>
                <span className="text-yellow-400">{inventory.crops.medieval}</span> Medieval
              </div>
              <div>
                <span className="text-blue-400">{inventory.crops.future}</span> Future
              </div>
            </div>
          </div>

          <Button className="bg-purple-700 hover:bg-purple-800" onClick={onReturnToHub}>
            Return to Hub
          </Button>
        </div>
      </div>

      {/* Controls reminder */}
      {showControls && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 p-4 rounded text-white text-center">
          <h3 className="font-bold mb-2">Controls:</h3>
          <p>WASD / Arrow Keys: Move</p>
          <p>Space: Jump</p>
          <p>E: Interact (Plant/Harvest)</p>
          <p className="mt-2 text-sm text-gray-400">This reminder will disappear in a few seconds</p>
        </div>
      )}
    </>
  )
}
