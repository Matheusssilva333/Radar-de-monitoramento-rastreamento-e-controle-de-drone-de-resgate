import { useState, useEffect, useRef } from 'react'
import Radar from './components/Radar'
import HUD from './components/HUD'
import ControlPanel from './components/ControlPanel'
import './App.css'

function App() {
  const [dronePosition, setDronePosition] = useState({ x: 0, y: 5, z: 0 })
  const [droneStatus, setDroneStatus] = useState({
    battery: 98,
    signal: -45,
    altitude: 120,
    velocity: 0,
    lat: -23.55052,
    lng: -46.633308
  })
  const [aiMessages, setAiMessages] = useState([
    "System initialized. GEMINI link established.",
    "Awaiting command for search and rescue mission.",
    "Scanning local airspace... Clear."
  ])

  // Simulation loop for drone "idling" or movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDronePosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 0.05,
        y: 5 + Math.sin(Date.now() / 1000) * 0.2, // Hovers slightly
        z: prev.z + (Math.random() - 0.5) * 0.05
      }))

      setDroneStatus(prev => ({
        ...prev,
        battery: Math.max(0, prev.battery - 0.01),
        altitude: 120 + Math.sin(Date.now() / 1000) * 2,
        lat: prev.lat + (Math.random() - 0.5) * 0.00001,
        lng: prev.lng + (Math.random() - 0.5) * 0.00001
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleCommand = (command) => {
    let newMessage = ""
    switch (command) {
      case 'takeoff':
        newMessage = "Initiating engine start. Ascent to 120m."
        setDroneStatus(prev => ({ ...prev, velocity: 15 }))
        break
      case 'land':
        newMessage = "Landing sequence engaged. Finding level terrain."
        setDroneStatus(prev => ({ ...prev, velocity: 5 }))
        break
      case 'rtl':
        newMessage = "Return to Launch triggered. Reverting via safe corridor."
        break
      case 'scan':
        newMessage = "Gemini Analysis: Potential heat signature detected at Sector 4B."
        break
      case 'mission':
        newMessage = "Uploading rescue waypoint data. Path optimized by AI."
        break
      case 'emergency':
        newMessage = "EMERGENCY PROTOCOL ACTIVE. All systems to manual override."
        break
      default:
        newMessage = `Command ${command} received.`
    }

    setAiMessages(prev => [newMessage, ...prev].slice(0, 10))
  }

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Radar dronePosition={dronePosition} />
      <HUD droneStatus={droneStatus} aiMessages={aiMessages} />
      <ControlPanel onCommand={handleCommand} />

      {/* Decorative Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        zIndex: 5
      }} />
    </div>
  )
}

export default App
