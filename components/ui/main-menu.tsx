"use client"
import { Button } from "@/components/ui/button"

type MainMenuProps = {
  onStart: () => void
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50">
      <div className="max-w-md w-full p-8 rounded-lg bg-gradient-to-b from-purple-900/80 to-indigo-900/80 backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-2 text-center">Chrono-Harvester 3D</h1>
        <p className="text-lg mb-8 text-center text-gray-300">Farm across time and space</p>

        <div className="space-y-4">
          <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700" onClick={onStart}>
            Start Game
          </Button>

          <Button className="w-full py-6 text-lg bg-gray-700 hover:bg-gray-800" disabled>
            Settings
          </Button>

          <Button className="w-full py-6 text-lg bg-gray-700 hover:bg-gray-800" disabled>
            Credits
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-400 text-center">
          <p>Use WASD or arrow keys to move</p>
          <p>Press E to interact with objects</p>
          <p>Space to jump</p>
        </div>
      </div>
    </div>
  )
}
