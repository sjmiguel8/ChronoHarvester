"use client"

import React, { useRef, useEffect } from "react" // Import useEffect
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei" // Import useGLTF
import { RigidBody } from "@react-three/rapier"
import { Group } from "three"

type PrehistoricSceneProps = {
  active: boolean
}

export default function PrehistoricScene({ active }: PrehistoricSceneProps) {
  const group = useRef<Group>(null)
  const gltf = useGLTF("/low_poly_forest.glb")
  const scene = gltf.scene

  useEffect(() => {
    if (!scene) {
      console.error("Error loading GLTF: Scene is null or undefined")
      return
    }
    console.log("GLTF Scene:", scene)
  }, [scene])

  // Animate gently swaying plants (if the GLTF has plants)
  useFrame(({ clock }) => {
    if (group.current && active) {
      const t = clock.getElapsedTime()
      group.current.children.forEach((child, i) => {
        // Example: Assuming the first few children are plants
        if (i < 10) { // Adjust the number based on your scene
          child.rotation.x = Math.sin(t + i * 100) * 0.05
          child.rotation.z = Math.cos(t + i * 100) * 0.05
        }
      })
    }
  })

  return (
    <group ref={group}>
      {/* Load the entire scene from the GLTF file */}
      <primitive object={scene} dispose={null} />

      {/* Ambient light to illuminate the scene */}
      <ambientLight intensity={0.2} />

      {/* Directional light for shadows and highlights */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.3}
        castShadow
      />

      {/* Fog effect for atmosphere */}
      <fog args={["#5d733a", 20, 60]} />
    </group>
  )
}