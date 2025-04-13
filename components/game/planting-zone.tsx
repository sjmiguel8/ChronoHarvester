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
  onPlant: () => boolean
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
          return 0
        }

        return newProgress
      })
    }
  })

  // Handle keyboard interaction (E key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e" && isPlayerNear) {
        // Prevent rapid interactions
        const now = Date.now()
        if (now - lastInteractionRef.current < 500) return
        lastInteractionRef.current = now

        if (!isPlanted) {
          // Try to plant a seed
          const success = onPlant()
          if (success) {
            setIsPlanted(true)
            setGrowthStage(0)
            setGrowthProgress(0)
            setShowInteractPrompt(false)
          }
        } else if (growthStage === GROWTH_STAGES.length - 1) {
          // Harvest mature crop
          onHarvest()
          setIsPlanted(false)
          setGrowthStage(0)
          setGrowthProgress(0)
          setShowInteractPrompt(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlayerNear, isPlanted, growthStage, onPlant, onHarvest])

  // Calculate crop height based on growth stage and progress
  const getCropHeight = () => {
    const baseHeights = [0.1, 0.3, 0.7, 1]
    if (growthStage < GROWTH_STAGES.length - 1) {
      return baseHeights[growthStage] + (baseHeights[growthStage + 1] - baseHeights[growthStage]) * growthProgress
    }
    return baseHeights[growthStage]
  }

  return (
    <group position={position}>
      {/* Planting zone marker */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#8d6e63" opacity={0.8} transparent />
      </mesh>

      {/* Planted crop */}
      {isPlanted && (
        <mesh position={[0, getCropHeight() / 2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.1, getCropHeight(), 8]} />
          <meshStandardMaterial color={cropColors[era]} />

          {/* Crop top/leaves */}
          {growthStage > 0 && (
            <mesh position={[0, getCropHeight() / 2, 0]} castShadow>
              <sphereGeometry args={[0.2 * getCropHeight(), 8, 8]} />
              <meshStandardMaterial color={cropColors[era]} />
            </mesh>
          )}
        </mesh>
      )}

      {/* Interaction prompt */}
      {showInteractPrompt && (
        <Text
          position={[0, 1.5, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="black"
        >
          {isPlanted ? "Press E to Harvest" : "Press E to Plant"}
        </Text>
      )}
    </group>
  )
}
