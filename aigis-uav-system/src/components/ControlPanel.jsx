import React from 'react'
import { Play, Square, Home, AlertTriangle, Crosshair, Map, Zap, Settings, RefreshCcw } from 'lucide-react'

export default function ControlPanel({ onCommand, onScenario }) {
    const controls = [
        { label: 'TAKEOFF', icono: <Play size={20} />, action: 'takeoff', color: 'var(--success)' },
        { label: 'SCAN', icono: <Crosshair size={20} />, action: 'scan', color: 'var(--primary)' },
        { label: 'RTL', icono: <Home size={20} />, action: 'rtl', color: 'var(--warning)' },
        { label: 'LAND', icono: <Square size={20} />, action: 'land', color: 'var(--text)' },
    ]

    const scenarios = [
        { label: 'RESCUE OPS', icono: <Zap size={18} />, action: 'rescue', color: '#00f2ff' },
        { label: 'EMERGENCY', icono: <AlertTriangle size={18} />, action: 'emergency', color: '#ff4d4d' },
        { label: 'RESET', icono: <RefreshCcw size={18} />, action: 'reset', color: '#fff' },
    ]

    return (
        <div className="control-panel-container">
            {/* Mission Controls */}
            <div className="control-section">
                <div className="section-label">COMMAND</div>
                <div className="button-grid">
                    {controls.map((ctrl) => (
                        <button
                            key={ctrl.action}
                            onClick={() => onCommand(ctrl.action)}
                            className="ctrl-btn"
                            style={{ '--btn-color': ctrl.color }}
                        >
                            {ctrl.icono}
                            <span>{ctrl.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Scenario Injects (For Hackathon Judges) */}
            <div className="control-section mt-6">
                <div className="section-label">SCENARIO INJECTS</div>
                <div className="scenario-list">
                    {scenarios.map((scen) => (
                        <button
                            key={scen.action}
                            onClick={() => onScenario(scen.action)}
                            className="scenario-btn"
                            style={{ '--btn-color': scen.color }}
                        >
                            <div className="scen-icon">{scen.icono}</div>
                            <div className="scen-text">
                                <span className="scen-label">{scen.label}</span>
                                <span className="scen-desc">Trigger AI Analysis</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <button className="settings-btn mt-auto">
                <Settings size={20} />
                <span>SYS CONFIG</span>
            </button>
        </div>
    )
}
