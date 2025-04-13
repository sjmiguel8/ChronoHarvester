"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Era } from "../chrono-harvester"

type EraSelectionProps = {
  onSelectEra: (era: Era) => void
  temporalEnergy: number
}

const eras = [
  {
    id: "prehistoric",
    name: "Prehistoric Era",
    description: "Ancient lands with primitive plants. Slower growth, higher yield.",
    energyCost: 20,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "medieval",
    name: "Medieval Era",
    description: "Feudal farmlands with balanced crops. Medium growth and yield.",
    energyCost: 30,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "future",
    name: "Future Era",
    description: "Advanced biomes with high-tech crops. Faster growth, lower yield.",
    energyCost: 40,
    image: "/placeholder.svg?height=100&width=200",
  },
]

export default function EraSelection({ onSelectEra, temporalEnergy }: EraSelectionProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50 p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Select Time Era</h1>
        <p className="text-center mb-8">
          Temporal Energy: <span className="text-cyan-400 font-bold">{temporalEnergy}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eras.map((era) => (
            <Card key={era.id} className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>{era.name}</CardTitle>
                <CardDescription className="text-gray-400">Energy Cost: {era.energyCost}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="w-full h-24 mb-4 bg-cover bg-center rounded"
                  style={{ backgroundImage: `url(${era.image})` }}
                />
                <p className="text-sm">{era.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  disabled={temporalEnergy < era.energyCost}
                  onClick={() => onSelectEra(era.id as Era)}
                >
                  Travel to Era
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-sm text-gray-400 text-center">
          <p>Each time travel depletes your Temporal Energy</p>
          <p>Return to the Present Hub to convert harvested crops into more energy</p>
        </div>
      </div>
    </div>
  )
}
