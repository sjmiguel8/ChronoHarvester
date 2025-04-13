"use client"

import { useEffect, useState } from "react"

type LoadingScreenProps = {
  progress: number
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const [dots, setDots] = useState(".")

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
      <h1 className="text-4xl font-bold mb-8">Chrono-Harvester 3D</h1>
      <div className="w-64 h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-green-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xl">Loading time streams{dots}</p>
      <p className="text-sm mt-8 max-w-md text-center text-gray-400">
        Preparing to harvest crops across the ages. Temporal stabilizers online.
      </p>
    </div>
  )
}
