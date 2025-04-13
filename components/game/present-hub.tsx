"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type PresentHubProps = {
  inventory: {
    seeds: Record<string, number>
    crops: Record<string, number>
  }
  temporalEnergy: number
  onSellCrops: () => number
  onReturnToEraSelection: () => void
}

export default function PresentHub({
  inventory,
  temporalEnergy,
  onSellCrops,
  onReturnToEraSelection,
}: PresentHubProps) {
  const [showSellResult, setShowSellResult] = useState(false)
  const [energyGained, setEnergyGained] = useState(0)

  const totalCrops = Object.values(inventory.crops).reduce((sum, count) => sum + count, 0)

  const handleSellCrops = () => {
    const gained = onSellCrops()
    setEnergyGained(gained)
    setShowSellResult(true)

    // Hide the result after 3 seconds
    setTimeout(() => {
      setShowSellResult(false)
    }, 3000)
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-40 p-4">
      <div className="max-w-2xl w-full">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Present Hub</CardTitle>
            <CardDescription className="text-gray-400">
              Process your harvested crops and prepare for your next expedition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-bold mb-2">Inventory</h3>
                <div className="space-y-1">
                  <p>
                    Prehistoric Crops: <span className="text-green-400">{inventory.crops.prehistoric}</span>
                  </p>
                  <p>
                    Medieval Crops: <span className="text-yellow-400">{inventory.crops.medieval}</span>
                  </p>
                  <p>
                    Future Crops: <span className="text-blue-400">{inventory.crops.future}</span>
                  </p>
                  <p className="font-bold mt-2">Total: {totalCrops} crops</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Resources</h3>
                <div className="space-y-1">
                  <p>
                    Temporal Energy: <span className="text-cyan-400">{temporalEnergy}</span>
                  </p>
                  <p>
                    Potential Energy from Crops: <span className="text-cyan-400">{totalCrops * 10}</span>
                  </p>
                </div>

                {showSellResult && energyGained > 0 && (
                  <div className="mt-4 p-2 bg-green-900/50 rounded">
                    <p>
                      Gained <span className="text-cyan-400 font-bold">{energyGained}</span> Temporal Energy!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="bg-green-700 hover:bg-green-800" disabled={totalCrops === 0} onClick={handleSellCrops}>
              Process Crops
            </Button>
            <Button className="bg-purple-700 hover:bg-purple-800" onClick={onReturnToEraSelection}>
              Time Portal
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 text-sm text-white text-center">
          <p>Move around the hub using WASD/Arrow keys</p>
          <p>Interact with the Crop Analyzer or Time Portal by approaching and pressing E</p>
        </div>
      </div>
    </div>
  )
}
