"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { RigidBody, CapsuleCollider } from "@react-three/rapier"
import { Vector3, Quaternion, Euler, Matrix4 } from "three"

export default function Player() {
  const playerRef = useRef<any>(null)
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const { camera } = useThree()

  // Player state
  const [playerPosition, setPlayerPosition] = useState(new Vector3(0, 1, 0))
  const [playerVelocity, setPlayerVelocity] = useState(new Vector3())
  const [playerRotation, setPlayerRotation] = useState(new Quaternion())

  // Movement parameters
  const speed = 5
  const jumpForce = 5
  const turnSpeed = 2

  // Update camera to follow player
  useFrame((state, delta) => {
    if (!playerRef.current) return

    // Get current player position
    const playerPosition = playerRef.current.translation()

    // Update camera position to follow player (with offset)
    const cameraOffset = new Vector3(0, 3, 5)
    const cameraTarget = new Vector3(playerPosition.x, playerPosition.y, playerPosition.z)

    // Get player rotation (only y-axis/yaw)
    const playerRotation = playerRef.current.rotation()
    const euler = new Euler().setFromQuaternion(playerRotation)

    // Rotate camera offset based on player rotation
    cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), euler.y)

    // Set camera position
    camera.position.copy(cameraTarget).add(cameraOffset)
    camera.lookAt(cameraTarget)

    // Handle movement
    const { forward, back, left, right, jump } = getKeys()

    // Calculate movement direction
    const moveDirection = new Vector3()

    // Forward/backward movement (relative to player orientation)
    if (forward) {
      moveDirection.z -= 1
    }
    if (back) {
      moveDirection.z += 1
    }

    // Left/right movement (relative to player orientation)
    if (left) {
      moveDirection.x -= 1
    }
    if (right) {
      moveDirection.x += 1
    }

    // Normalize movement direction
    if (moveDirection.length() > 0) {
      moveDirection.normalize()
    }

    // Apply player rotation to movement direction
    moveDirection.applyQuaternion(playerRotation)

    // Scale by speed and delta time
    moveDirection.multiplyScalar(speed * delta)

    // Apply movement
    const currentVelocity = playerRef.current.linvel()

    playerRef.current.setLinvel({
      x: moveDirection.x,
      y: currentVelocity.y, // Preserve vertical velocity (for jumping/falling)
      z: moveDirection.z,
    })

    // Handle jumping
    if (jump && Math.abs(currentVelocity.y) < 0.1) {
      playerRef.current.setLinvel({
        x: currentVelocity.x,
        y: jumpForce,
        z: currentVelocity.z,
      })
    }

    // Handle rotation (turn in the direction of movement)
    if (moveDirection.length() > 0) {
      const targetRotation = new Quaternion()
      const lookDirection = new Vector3(moveDirection.x, 0, moveDirection.z).normalize()
      const lookAt = new Vector3(
        playerPosition.x + lookDirection.x,
        playerPosition.y,
        playerPosition.z + lookDirection.z,
      )

      const targetDirection = new Vector3()
        .subVectors(lookAt, new Vector3(playerPosition.x, playerPosition.y, playerPosition.z))
        .normalize()
      const targetQuaternion = new Quaternion().setFromRotationMatrix(
        new Matrix4().lookAt(new Vector3(0, 0, 0), targetDirection, new Vector3(0, 1, 0)),
      )

      playerRef.current.setRotation(targetQuaternion)
    }
  })

  return (
    <RigidBody
      ref={playerRef}
      position={[0, 2, 0]}
      enabledRotations={[false, true, false]}
      linearDamping={0.5}
      angularDamping={0.5}
      colliders={false}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial color="#f5a742" />
      </mesh>
      {/* Player head */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f5a742" />
      </mesh>
    </RigidBody>
  )
}
