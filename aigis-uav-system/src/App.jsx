import { useState, useEffect, useRef } from 'react'
import Radar from './components/Radar'
import HUD from './components/HUD'
import ControlPanel from './components/ControlPanel'
import './App.css'

function App() {
  const [telemetry, setTelemetry] = useState(null)
  const [aiMessages, setAiMessages] = useState([
    "System initialized. G3-FLASH tactical link established.",
    "Awaiting command for search and rescue mission.",
    "GEMINI-3 FLASH // Scanning local airspace... Clear."
  ])
  const ws = useRef(null)

  useEffect(() => {
    // Connect to dynamic WebSocket host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const wsUrl = import.meta.env.DEV
      ? 'ws://localhost:8000/ws/telemetry'
      : `${protocol}//${host}/ws/telemetry`

    ws.current = new WebSocket(wsUrl)

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setTelemetry(data)

      // Stable AI Alert Handler
      if (data.status?.ai_alert) {
        setAiMessages(prev => {
          if (prev[0] === data.status.ai_alert) return prev
          return [data.status.ai_alert, ...prev].slice(0, 15)
        })
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error)
      setAiMessages(prev => ["ERROR: Telemetry link unstable.", ...prev].slice(0, 10))
    }

    return () => {
      if (ws.current) ws.current.close()
    }
  }, []) // Connection is established only ONCE

  const handleScenario = async (scenario) => {
    try {
      const apiBase = import.meta.env.DEV
        ? 'http://localhost:8000/api'
        : `${window.location.origin}/api`

      await fetch(`${apiBase}/scenario/${scenario}`, { method: 'POST' })

      const scenarioMsgs = {
        'rescue': "SCENARIO_INJECT: Initiating Rescue Search Pattern.",
        'emergency': "SCENARIO_INJECT: Warning - Simulated Power Plant Anomaly.",
        'mapping': "SCENARIO_INJECT: Executing 3D Terrain Reconstruction Protocol.",
        'reset': "SCENARIO_INJECT: System Hardware Re-initialization."
      }

      setAiMessages(prev => [scenarioMsgs[scenario] || "SCENARIO_INJECT: Custom protocol.", ...prev].slice(0, 15))
    } catch (err) {
      console.error("Scenario injection failed", err)
    }
  }

  const handleCommand = async (command) => {
    try {
      const apiBase = import.meta.env.DEV
        ? 'http://localhost:8000/api'
        : `${window.location.origin}/api`

      const response = await fetch(`${apiBase}/command/${command}`, { method: 'POST' })
      const data = await response.json()

      let newMessage = ""
      switch (command) {
        case 'takeoff': newMessage = "Initiating engine start. Ascent to safe flight altitude."; break
        case 'land': newMessage = "Landing sequence engaged. Finding stable terrain."; break
        case 'rtl': newMessage = "Return to Launch triggered. Reverting via safe corridor."; break
        case 'scan': newMessage = "GEMINI-3 FLASH // Scanning Sector Alpha for thermal signatures..."; break
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

      <HUD telemetry={telemetry} />

      <ControlPanel
        onCommand={handleCommand}
        onScenario={handleScenario}
      />

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
