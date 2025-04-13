"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { KeyboardControls, Loader } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"

import GameScene from "./game/game-scene"
import LoadingScreen from "./ui/loading-screen"
import MainMenu from "./ui/main-menu"
import EraSelection from "./ui/era-selection"
import GameUI from "./ui/game-ui"
import PresentHub from "./game/present-hub"

// Define keyboard controls
export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
  interact: "interact",
}

// Game states
export type GameState = "loading" | "menu" | "era-selection" | "game" | "hub"
export type Era = "prehistoric" | "medieval" | "future"

export default function ChronoHarvester() {
  const [gameState, setGameState] = useState<GameState>("loading")
  const [selectedEra, setSelectedEra] = useState<Era>("prehistoric")
  const [inventory, setInventory] = useState({
    seeds: { prehistoric: 5, medieval: 5, future: 5 },
    crops: { prehistoric: 0, medieval: 0, future: 0 },
  })
  const [temporalEnergy, setTemporalEnergy] = useState(100)
  const [isLoaded, setIsLoaded] = useState(false)

  // Simulate loading assets
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setGameState("menu")
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Handle game state transitions
  const startGame = () => setGameState("era-selection")
  const selectEra = (era: Era) => {
    setSelectedEra(era)
    setGameState("game")
  }
  const returnToHub = () => setGameState("hub")
  const returnToEraSelection = () => setGameState("era-selection")

  // Game mechanics
  const addCrop = (era: Era) => {
    setInventory((prev) => ({
      ...prev,
      crops: { ...prev.crops, [era]: prev.crops[era] + 1 },
    }))
  }

  const useSeed = (era: Era) => {
    if (inventory.seeds[era] > 0) {
      setInventory((prev) => ({
        ...prev,
        seeds: { ...prev.seeds, [era]: prev.seeds[era] - 1 },
      }))
      return true
    }
    return false
  }

  const sellCrops = () => {
    const totalCrops = Object.values(inventory.crops).reduce((sum, count) => sum + count, 0)
    if (totalCrops > 0) {
      // Convert crops to energy (10 energy per crop)
      const energyGained = totalCrops * 10
      setTemporalEnergy((prev) => prev + energyGained)

      // Reset crop inventory
      setInventory((prev) => ({
        ...prev,
        crops: { prehistoric: 0, medieval: 0, future: 0 },
      }))

      return energyGained
    }
    return 0
  }

  // Render appropriate UI based on game state
  const renderUI = () => {
    switch (gameState) {
      case "loading":
        return <LoadingScreen progress={isLoaded ? 100 : 50} />
      case "menu":
        return <MainMenu onStart={startGame} />
      case "era-selection":
        return <EraSelection onSelectEra={selectEra} temporalEnergy={temporalEnergy} />
      case "game":
        return (
          <GameUI inventory={inventory} temporalEnergy={temporalEnergy} era={selectedEra} onReturnToHub={returnToHub} />
        )
      case "hub":
        return (
          <PresentHub
            inventory={inventory}
            temporalEnergy={temporalEnergy}
            onSellCrops={sellCrops}
            onReturnToEraSelection={returnToEraSelection}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <KeyboardControls
        map={[
          { name: Controls.forward, keys: ["ArrowUp", "w", "W"] },
          { name: Controls.back, keys: ["ArrowDown", "s", "S"] },
          { name: Controls.left, keys: ["ArrowLeft", "a", "A"] },
          { name: Controls.right, keys: ["ArrowRight", "d", "D"] },
          { name: Controls.jump, keys: ["Space"] },
          { name: Controls.interact, keys: ["e", "E"] },
        ]}
      >
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <Suspense fallback={null}>
            <Physics>
              {gameState === "game" && <GameScene era={selectedEra} addCrop={addCrop} useSeed={useSeed} />}
              {gameState === "hub" && <GameScene era="hub" addCrop={addCrop} useSeed={useSeed} />}
            </Physics>
            <EffectComposer>
              <Bloom intensity={0.5} luminanceThreshold={0.9} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      {renderUI()}
      <Loader />
    </>
  )
}
