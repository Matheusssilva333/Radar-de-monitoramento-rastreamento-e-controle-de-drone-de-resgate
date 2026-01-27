import { useState, useEffect, useRef } from 'react'
import Radar from './components/Radar'
import HUD from './components/HUD'
import ControlPanel from './components/ControlPanel'
import './App.css'

function App() {
  const [telemetry, setTelemetry] = useState(null)
  const [aiMessages, setAiMessages] = useState([
    "System initialized. GEMINI link established.",
    "Awaiting command for search and rescue mission.",
    "Scanning local airspace... Clear."
  ])
  const ws = useRef(null)

  useEffect(() => {
    // Connect to FastAPI WebSocket
    ws.current = new WebSocket('ws://localhost:8000/ws/telemetry')

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setTelemetry(data)
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error)
      setAiMessages(prev => ["ERROR: Telemetry link lost. Retrying...", ...prev].slice(0, 10))
    }

    return () => {
      if (ws.current) ws.current.close()
    }
  }, [])

  const handleCommand = async (command) => {
    try {
      const response = await fetch(`http://localhost:8000/command/${command}`, { method: 'POST' })
      const data = await response.json()
      
      let newMessage = ""
      switch (command) {
        case 'takeoff': newMessage = "Initiating engine start. Ascent to safe flight altitude."; break
        case 'land': newMessage = "Landing sequence engaged. Finding stable terrain."; break
        case 'rtl': newMessage = "Return to Launch triggered. Reverting via safe corridor."; break
        case 'scan': newMessage = "Gemini AI: Scanning Sector Alpha for thermal signatures..."; break
        case 'mission': newMessage = "Mission parameters updated. Path optimization in progress."; break
        case 'emergency': newMessage = "ATTENTION: EMERGENCY PROTOCOL ACTIVE. RTL INITIATED."; break
        default: newMessage = `Command ${command} transmitted.`; break
      }
      
      setAiMessages(prev => [newMessage, ...prev].slice(0, 10))
    } catch (error) {
      console.error("Command Error:", error)
      setAiMessages(prev => ["SYSTEM FAIL: Link unstable. Command not transmitted.", ...prev].slice(0, 10))
    }
  }

  if (!telemetry) {
    return (
      <div className="loading" style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'var(--bg)',
        color: 'var(--primary)'
      }}>
        <div className="glow-text" style={{ fontSize: '2rem', letterSpacing: '8px' }}>AIGIS TACTICAL</div>
        <div style={{ marginTop: '20px', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>LINKING TO UAV TELEMETRY...</div>
      </div>
    )
  }

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="crt-scanline" />
      
      <Radar 
        dronePosition={telemetry.position} 
        targets={telemetry.targets} 
      />
      
      <HUD 
        droneStatus={telemetry.status} 
        aiMessages={aiMessages} 
        position={telemetry.position}
      />
      
      <ControlPanel onCommand={handleCommand} />

      {/* Decorative Vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        boxShadow: 'inset 0 0 200px rgba(0,0,0,0.9)',
        pointerEvents: 'none',
        zIndex: 5
      }} />
    </div>
  )
}

export default App
