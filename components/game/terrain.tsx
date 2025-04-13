"use client"

import { RigidBody } from "@react-three/rapier"

type TerrainProps = {
  color?: string
}

export default function Terrain({ color = "#4a7c59" }: TerrainProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
