import { useState, useEffect, useRef } from 'react'
import Radar from './components/Radar'
import HUD from './components/HUD'
import ControlPanel from './components/ControlPanel'
import './App.css'

function RoboticJoystick({ label, onMove }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const containerRef = useRef()

  const handleStart = () => { isDragging.current = true }
  const handleEnd = () => {
    isDragging.current = false
    setPos({ x: 0, y: 0 })
    onMove({ x: 0, y: 0 })
  }
  const handleMove = (e) => {
    if (!isDragging.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Support touch and mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    let x = (clientX - rect.left - centerX) / centerX
    let y = (clientY - rect.top - centerY) / centerY

    // Clamp to circle
    const dist = Math.sqrt(x * x + y * y)
    if (dist > 1) { x /= dist; y /= dist; }

    setPos({ x: x * 40, y: y * 40 })
    onMove({ x, y: -y }) // Invert Y for aerospace standard
  }

  return (
    <div
      className="joystick-ring"
      ref={containerRef}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        className="joystick-knob"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      />
      <div className="joystick-label">{label}</div>
    </div>
  )
}

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
    console.log("Connecting to Tactical Link:", wsUrl)

    ws.current.onopen = () => {
      console.log("Tactical Link Established [OK]")
      setAiMessages(prev => ["SYSTEM: Telemetry link established.", ...prev].slice(0, 10))
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // console.log("TLM REDV:", data.status.state, data.status.altitude)
      setTelemetry(data)

      if (data.status?.ai_alert) {
        setAiMessages(prev => {
          if (prev[0] === data.status.ai_alert) return prev
          return [data.status.ai_alert, ...prev].slice(0, 20)
        })
      }
    }

    ws.current.onerror = (error) => {
      console.error("Tactical Link Fail:", error)
      setAiMessages(prev => ["CRITICAL: Telemetry signal lost.", ...prev].slice(0, 10))
    }

    ws.current.onclose = () => {
      console.warn("Tactical Link Closed.")
      setAiMessages(prev => ["LINK LOST: Re-establishing...", ...prev].slice(0, 10))
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

  const [isRoboticMode, setIsRoboticMode] = useState(false)
  const joystickState = useRef({ lv: 0, lh: 0, rv: 0, rh: 0 })

  const sendJoystickUpdate = async () => {
    if (!isRoboticMode) return
    try {
      const apiBase = import.meta.env.DEV ? 'http://localhost:8000/api' : `${window.location.origin}/api`
      await fetch(`${apiBase}/joystick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joystickState.current)
      })
    } catch (e) { console.error("RC Link Error", e) }
  }

  useEffect(() => {
    let interval;
    if (isRoboticMode) {
      interval = setInterval(sendJoystickUpdate, 150) // 6.6Hz update rate for stability
    }
    return () => clearInterval(interval)
  }, [isRoboticMode])

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
        state={telemetry.status.state}
      />

      <HUD telemetry={telemetry} />

      <ControlPanel
        onCommand={handleCommand}
        onScenario={handleScenario}
        isRoboticEnabled={isRoboticMode}
        onToggleRobotic={() => setIsRoboticMode(!isRoboticMode)}
      />

      {isRoboticMode && (
        <div className="robotic-overlay glass-panel">
          <div className="robotic-header">
            <span className="pulse-dot" />
            DIRECT UAV CONTROL LINK [HARDWARE ADAPTIVE]
          </div>
          <div className="robotic-joysticks">
            <RoboticJoystick
              label="THRUST / YAW"
              onMove={(v) => { joystickState.current.lv = v.y; joystickState.current.lh = v.x; }}
            />
            <RoboticJoystick
              label="PITCH / ROLL"
              onMove={(v) => { joystickState.current.rv = v.y; joystickState.current.rh = v.x; }}
            />
          </div>
          <div className="robotic-footer">
            PRECISION TRAJECTORY TRACKING ACTIVE
          </div>
        </div>
      )}

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
