"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { MeshDistortMaterial } from "@react-three/drei"
import { Color } from "three"

type TemporalDistortionProps = {
  position: [number, number, number]
  scale?: number
}

export default function TemporalDistortion({ position, scale = 1 }: TemporalDistortionProps) {
  const distortionRef = useRef<any>(null)

  // Animate the distortion
  useFrame((state, delta) => {
    if (distortionRef.current) {
      // Rotate the distortion
      distortionRef.current.rotation.y += delta * 0.5

      // Pulsate the distortion
      const pulsate = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      distortionRef.current.scale.set(scale * pulsate, scale * pulsate, scale * pulsate)
    }
  })

  return (
    <group position={position}>
      {/* Visual distortion effect */}
      <mesh ref={distortionRef} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#9c27b0"
          speed={5}
          distort={0.5}
          radius={1}
          emissive={new Color("#6a1b9a")}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Collision body (smaller than visual effect) */}
      <RigidBody type="fixed" colliders="ball" sensor>
        <mesh visible={false}>
          <sphereGeometry args={[0.8, 16, 16]} />
        </mesh>
      </RigidBody>
    </group>
  )
}
