"use client"

import { useState, useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { Vector3 } from "three"
import type { Era } from "../chrono-harvester"

type PlantingZoneProps = {
  position: [number, number, number]
  era: Era
  onHarvest: () => void
  onPlant: () => void
}

// Era-specific crop colors
const cropColors = {
  prehistoric: "#8bc34a",
  medieval: "#cddc39",
  future: "#4fc3f7",
}

// Growth stages
const GROWTH_STAGES = ["seed", "sprout", "growing", "mature"]

export default function PlantingZone({ position, era, onHarvest, onPlant }: PlantingZoneProps) {
  const [isPlayerNear, setIsPlayerNear] = useState(false)
  const [isPlanted, setIsPlanted] = useState(false)
  const [growthStage, setGrowthStage] = useState(0)
  const [growthProgress, setGrowthProgress] = useState(0)
  const [showInteractPrompt, setShowInteractPrompt] = useState(false)
  const { scene } = useThree()

  // Reference to track last interaction time
  const lastInteractionRef = useRef(0)

  // Check if player is near the planting zone
  useFrame(() => {
    // Find player object in the scene
    const player =
      scene.getObjectByName("player") || scene.children.find((child) => child.userData && child.userData.isPlayer)

    if (player) {
      const playerPosition = new Vector3().setFromMatrixPosition(player.matrixWorld)
      const zonePosition = new Vector3(...position)
      const distance = playerPosition.distanceTo(zonePosition)

      // Player is considered "near" if within 3 units
      const wasNear = isPlayerNear
      const isNear = distance < 3

      if (isNear !== wasNear) {
        setIsPlayerNear(isNear)
        setShowInteractPrompt(isNear && (!isPlanted || growthStage === GROWTH_STAGES.length - 1))
      }
    }
  })

  // Handle growth of planted crops
  useFrame((state, delta) => {
    if (isPlanted && growthStage < GROWTH_STAGES.length - 1) {
      // Increase growth progress
      setGrowthProgress((prev) => {
        const newProgress = prev + delta * 0.1 // Adjust growth speed here

        // Move to next growth stage if progress reaches 1
        if (newProgress >= 1) {
          setGrowthStage((prev) => prev + 1)
          setShowInteractPrompt(isPlayerNear && growthStage + 1 === GROWTH_STAGES.length - 1)
          return 0
        }
        return newProgress
      })
    }
  })

  // Handle player interaction (planting or harvesting)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyE" && isPlayerNear) {
        const now = Date.now()
        // Prevent rapid interactions with a cooldown
        if (now - lastInteractionRef.current < 500) return
        lastInteractionRef.current = now

        if (!isPlanted) {
          // Plant a seed
          setIsPlanted(true)
          setGrowthStage(0)
          setGrowthProgress(0)
          setShowInteractPrompt(false)
          onPlant()
        } else if (growthStage === GROWTH_STAGES.length - 1) {
          // Harvest mature crop
          setIsPlanted(false)
          setGrowthStage(0)
          setGrowthProgress(0)
          setShowInteractPrompt(isPlayerNear)
          onHarvest()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [isPlayerNear, isPlanted, growthStage, onHarvest, onPlant])

  return (
    <group position={position}>
      {/* Ground marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color={isPlanted ? cropColors[era] : "#6b7280"} opacity={0.8} transparent />
      </mesh>

      {/* Planted crop visualization */}
      {isPlanted && (
        <mesh position={[0, growthStage * 0.1 + 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.1, 0.2 + growthStage * 0.2, 8]} />
          <meshStandardMaterial color={cropColors[era]} />
          {growthStage > 0 && (
            <mesh position={[0, 0.15 + growthStage * 0.1, 0]}>
              <sphereGeometry args={[0.15 + growthStage * 0.05, 8, 8]} />
              <meshStandardMaterial color={cropColors[era]} />
            </mesh>
          )}
        </mesh>
      )}

      {/* Interaction prompt */}
      {showInteractPrompt && (
        <Text
          position={[0, 1, 0]}
          rotation={[0, Math.PI / 4, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          userData={{ keepAlive: true }}
        >
          {isPlanted ? "Press E to Harvest" : "Press E to Plant"}
        </Text>
      )}
    </group>
  )
}
