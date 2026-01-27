import React from 'react'
import { Activity, Battery, Signal, Navigation, Shield, Zap, Target, Cpu, Clock } from 'lucide-react'

export default function HUD({ telemetry }) {
    if (!telemetry) return <div className="loading-hud">INITIALIZING TACTICAL LINK...</div>

    const { status, position } = telemetry
    const { battery, state, ai_alert, mission_time, velocity, health, altitude } = status

    return (
        <div className="hud-overlay">
            {/* Top Bar - Mission Status */}
            <div className="hud-top-bar">
                <div className="hud-group">
                    <Activity className="hud-icon pulse" />
                    <div className="hud-label-group">
                        <span className="hud-label">MISSION STATUS</span>
                        <span className="hud-value status-active">{state}</span>
                    </div>
                </div>

                <div className="hud-title-center">
                    <span className="aigis-logo">AIGIS-UAV</span>
                    <span className="aigis-subtitle">TACTICAL COMMAND & CONTROL</span>
                </div>

                <div className="hud-group align-right">
                    <div className="hud-label-group text-right">
                        <span className="hud-label">MISSION TIME</span>
                        <span className="hud-value font-mono">{new Date(mission_time * 1000).toISOString().substr(11, 8)}</span>
                    </div>
                    <Clock className="hud-icon" />
                </div>
            </div>

            {/* Left Panel - Flight Gauges */}
            <div className="hud-left-panel">
                <div className="hud-card">
                    <div className="card-header">
                        <Navigation size={14} />
                        <span>FLIT DATA</span>
                    </div>
                    <div className="gauge-row">
                        <div className="gauge">
                            <span className="gauge-val">{altitude}m</span>
                            <span className="gauge-lab">ALTITUDE</span>
                        </div>
                        <div className="gauge">
                            <span className="gauge-val">{velocity}km/h</span>
                            <span className="gauge-lab">VELOCITY</span>
                        </div>
                    </div>
                    <div className="position-data">
                        <span>LAT: -23.5505</span>
                        <span>LNG: -46.6333</span>
                    </div>
                </div>

                <div className="hud-card mt-4">
                    <div className="card-header">
                        <Cpu size={14} />
                        <span>SYSTEM HEALTH</span>
                    </div>
                    {Object.entries(health || {}).map(([key, val]) => (
                        <div key={key} className="health-row">
                            <span className="health-key text-uppercase">{key}</span>
                            <span className="health-val">{val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Power & Signal */}
            <div className="hud-right-panel">
                <div className="hud-card battery-card">
                    <div className="battery-header">
                        <Battery size={16} color={battery < 20 ? 'var(--danger)' : 'var(--primary)'} />
                        <span className="battery-val">{battery}%</span>
                    </div>
                    <div className="battery-bar-container">
                        <div
                            className="battery-bar-fill"
                            style={{ width: `${battery}%`, backgroundColor: battery < 20 ? 'red' : 'cyan' }}
                        />
                    </div>
                </div>

                <div className="hud-card mt-4 signal-card">
                    <div className="card-header">
                        <Signal size={14} />
                        <span>SIGNAL-LINK</span>
                    </div>
                    <div className="signal-strength">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="signal-bar" style={{ opacity: i <= 4 ? 1 : 0.3 }} />
                        ))}
                    </div>
                    <span className="signal-db">-42 dBm (STABLE)</span>
                </div>
            </div>

            {/* Bottom Feed - AI Insights */}
            <div className="hud-bottom-feed">
                <div className="ai-feed-container">
                    <div className="ai-header">
                        <Zap size={14} className="flash-green" />
                        <span>GEMINI-3 FLASH TACTICAL REASONING</span>
                    </div>
                    <div className="ai-message">
                        {ai_alert}
                    </div>
                </div>
            </div>

            {/* Crosshair Overlay */}
            <div className="hud-crosshair">
                <div className="ch-line-h" />
                <div className="ch-line-v" />
                <div className="ch-box" />
            </div>
        </div>
    )
}
