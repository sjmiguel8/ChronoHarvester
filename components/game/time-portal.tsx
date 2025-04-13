"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { Text } from "@react-three/drei"
import { MeshDistortMaterial } from "@react-three/drei"
import { Color } from "three"
import { useRouter } from 'next/navigation' // ADDED

type TimePortalProps = {
  position: [number, number, number]
}

export default function TimePortal({ position }: TimePortalProps) {
  const portalRef = useRef<any>(null)
  const ringRef = useRef<any>(null)
  const router = useRouter() // ADDED

  // Animate the portal
  useFrame((state, delta) => {
    if (portalRef.current) {
      // Rotate the portal
      portalRef.current.rotation.z += delta * 0.2

      // Pulsate the portal
      const pulsate = Math.sin(state.clock.elapsedTime) * 0.1 + 1
      portalRef.current.scale.set(pulsate, pulsate, pulsate)
    }

    if (ringRef.current) {
      // Rotate the ring in the opposite direction
      ringRef.current.rotation.z -= delta * 0.1
    }
  })

  const handlePortalClick = () => { // ADDED
    console.log("Portal clicked!")
    router.push('/era-selection') // Replace '/era-selection' with the actual route
  }

  return (
    <group position={position}>
      {/* Portal effect */}
      <mesh ref={portalRef} castShadow onClick={handlePortalClick}> {/* ADDED onClick */}
        <torusGeometry args={[2, 0.5, 16, 32]} />
        <MeshDistortMaterial
          color="#00bcd4"
          speed={3}
          distort={0.3}
          radius={1}
          emissive={new Color("#006064")}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <torusGeometry args={[2.5, 0.2, 16, 32]} />
        <meshStandardMaterial color="#4dd0e1" emissive={new Color("#00838f")} emissiveIntensity={0.5} />
      </mesh>

      {/* Portal center */}
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[1.8, 32]} />
        <meshBasicMaterial color="#b2ebf2" transparent opacity={0.7} />
      </mesh>

      {/* Interaction text */}
      <Text
        position={[0, 3, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        Return to Hub (Press E)
      </Text>

      {/* Collision body */}
      <RigidBody type="fixed" colliders="cuboid" sensor>
        <mesh visible={false}>
          <boxGeometry args={[4, 4, 1]} />
        </mesh>
      </RigidBody>
    </group>
  )
}
