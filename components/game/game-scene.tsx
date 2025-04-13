"use client"

import { useState, useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { Sky, Environment, Text } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"

import Player from "./player"
import Terrain from "./terrain"
import PlantingZone from "./planting-zone"
import TemporalDistortion from "./temporal-distortion"
import TimePortal from "./time-portal"
import PrehistoricScene from "./prehistoric-scene"
import type { Era } from "../chrono-harvester"

// Define era-specific settings
const eraSettings = {
  prehistoric: {
    skyProps: { sunPosition: [100, 20, 100], turbidity: 10, rayleigh: 0.5 },
    environment: "forest",
    terrainColor: "#4a7c59",
    distortionCount: 3,
  },
  medieval: {
    skyProps: { sunPosition: [100, 30, 100], turbidity: 8, rayleigh: 0.3 },
    environment: "dawn",
    terrainColor: "#5d8a68",
    distortionCount: 2,
  },
  future: {
    skyProps: { sunPosition: [100, 40, 100], turbidity: 5, rayleigh: 0.2 },
    environment: "night",
    terrainColor: "#3a5f78",
    distortionCount: 5,
  },
  hub: {
    skyProps: { sunPosition: [100, 50, 100], turbidity: 3, rayleigh: 0.1 },
    environment: "studio",
    terrainColor: "#6a7b82",
    distortionCount: 0,
  },
}

// Generate random positions for planting zones
const generatePlantingZones = (count: number, era: Era | "hub") => {
  const zones = []
  for (let i = 0; i < count; i++) {
    zones.push({
      id: `zone-${i}`,
      position: [(Math.random() - 0.5) * 40, 0.05, (Math.random() - 0.5) * 40] as [number, number, number],
      era: era === "hub" ? "prehistoric" : era,
    })
  }
  return zones
}

// Generate random positions for temporal distortions
const generateDistortions = (count: number) => {
  const distortions = []
  for (let i = 0; i < count; i++) {
    distortions.push({
      id: `distortion-${i}`,
      position: [(Math.random() - 0.5) * 40, 1 + Math.random() * 2, (Math.random() - 0.5) * 40] as [
        number,
        number,
        number,
      ],
      scale: 0.5 + Math.random() * 1.5,
    })
  }
  return distortions
}

type GameSceneProps = {
  era: Era | "hub"
  addCrop: (era: Era) => void
  useSeed: (era: Era) => boolean
}

export default function GameScene({ era, addCrop, useSeed }: GameSceneProps) {
  const { scene } = useThree()
  const settings = eraSettings[era]

  // Generate planting zones and distortions
  const [plantingZones] = useState(() => generatePlantingZones(era === "hub" ? 0 : 10, era))
  const [distortions] = useState(() => generateDistortions(era === "hub" ? 0 : settings.distortionCount))

  // Set scene background color
  useEffect(() => {
    scene.background = null
    return () => {
      scene.background = null
    }
  }, [scene, era])

  const handlePlant = (zoneEra: Era) => {
    useSeed(zoneEra)
  }

  return (
    <>
      {/* Environment */}
      <Sky {...{ ...settings.skyProps, sunPosition: settings.skyProps.sunPosition as [number, number, number] }} />
      <Environment preset={settings.environment as any} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={2048} />

      {/* Terrain */}
      <Terrain color={settings.terrainColor} />

      {/* Player */}
      <Player />

      {/* Planting Zones */}
      {plantingZones.map((zone) => (
        <PlantingZone
          key={zone.id}
          position={zone.position}
          era={zone.era as Era}
          onHarvest={() => addCrop(zone.era as Era)}
          onPlant={() => handlePlant(zone.era as Era)}
        />
      ))}

      {/* Era-specific scenes */}
      {era === "prehistoric" && <PrehistoricScene active={true} />}

      {/* Temporal Distortions */}
      {distortions.map((distortion) => (
        <TemporalDistortion key={distortion.id} position={distortion.position} scale={distortion.scale} />
      ))}

      {/* Time Portal (only in game scenes, not hub) */}
      {era !== "hub" && <TimePortal position={[0, 1, -15]} />}

      {/* Hub-specific elements */}
      {era === "hub" && (
        <>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, 1, -5]} receiveShadow castShadow>
              <boxGeometry args={[4, 2, 2]} />
              <meshStandardMaterial color="#6a8caf" />
            </mesh>
            <Text
              position={[0, 2, -5]}
              rotation={[0, Math.PI, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Crop Analyzer
            </Text>
          </RigidBody>

          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[5, 1, 0]} receiveShadow castShadow>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#af6a8c" />
            </mesh>
            <Text
              position={[5, 2, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Time Portal
            </Text>
          </RigidBody>
        </>
      )}

      {/* Invisible walls to prevent falling off the map */}
      <CuboidCollider args={[50, 10, 1]} position={[0, 0, 50]} />
      <CuboidCollider args={[50, 10, 1]} position={[0, 0, -50]} />
      <CuboidCollider args={[1, 10, 50]} position={[50, 0, 0]} />
      <CuboidCollider args={[1, 10, 50]} position={[-50, 0, 0]} />
    </>
  )
}
