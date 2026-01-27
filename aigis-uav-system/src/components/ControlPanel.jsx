import React, { useState } from 'react'
import { Play, Square, Home, AlertTriangle, Crosshair, Zap, Settings, RefreshCcw, Loader2, CheckCircle2 } from 'lucide-react'

export default function ControlPanel({ onCommand, onScenario }) {
    const [loadingAction, setLoadingAction] = useState(null)
    const [successAction, setSuccessAction] = useState(null)

    const controls = [
        { label: 'TAKEOFF', icono: <Play size={20} />, action: 'takeoff', color: 'var(--success)' },
        { label: 'SCAN', icono: <Crosshair size={20} />, action: 'scan', color: 'var(--primary)' },
        { label: 'RTL', icono: <Home size={20} />, action: 'rtl', color: 'var(--warning)' },
        { label: 'LAND', icono: <Square size={20} />, action: 'land', color: 'var(--text)' },
    ]

    const scenarios = [
        { label: '3D MAP SCAN', icono: <Map size={18} />, action: 'mapping', color: '#a855f7', desc: 'Generate Terrain Model' },
        { label: 'RESCUE OPS', icono: <Zap size={18} />, action: 'rescue', color: '#00f2ff', desc: 'Sector ALPHA-4 Rescue' },
        { label: 'EMERGENCY', icono: <AlertTriangle size={18} />, action: 'emergency', color: '#ff4d4d', desc: 'Critical Battery Fail' },
        { label: 'RESET', icono: <RefreshCcw size={18} />, action: 'reset', color: '#fff', desc: 'Full System Reboot' },
    ]

    const handleAction = async (type, action, fn) => {
        setLoadingAction(action)
        try {
            await fn(action)
            setSuccessAction(action)
            setTimeout(() => setSuccessAction(null), 2000)
        } catch (err) {
            console.error("Action failed", err)
        } finally {
            setLoadingAction(null)
        }
    }

    return (
        <div className="control-panel-container glass-panel">
            <div className="panel-header-tactical">
                <div className="status-dot-active" />
                <span>TACTICAL INTERFACE VER 3.0</span>
            </div>

            {/* Mission Controls */}
            <div className="control-section mt-4">
                <div className="section-header">
                    <div className="section-label">PRIMARY COMMANDS</div>
                    <div className="section-line" />
                </div>
                <div className="button-grid">
                    {controls.map((ctrl) => (
                        <button
                            key={ctrl.action}
                            disabled={loadingAction === ctrl.action}
                            onClick={() => handleAction('cmd', ctrl.action, onCommand)}
                            className={`ctrl-btn ${loadingAction === ctrl.action ? 'btn-loading' : ''} ${successAction === ctrl.action ? 'btn-success' : ''}`}
                            style={{ '--btn-color': ctrl.color }}
                        >
                            {loadingAction === ctrl.action ? <Loader2 className="animate-spin" size={20} /> : (successAction === ctrl.action ? <CheckCircle2 size={20} /> : ctrl.icono)}
                            <span>{ctrl.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Scenario Injects (For Hackathon Judges) */}
            <div className="control-section mt-6">
                <div className="section-header">
                    <div className="section-label">SCENARIO INJECTS</div>
                    <div className="section-line" />
                </div>
                <div className="scenario-list">
                    {scenarios.map((scen) => (
                        <button
                            key={scen.action}
                            disabled={loadingAction === scen.action}
                            onClick={() => handleAction('scen', scen.action, onScenario)}
                            className={`scenario-btn ${loadingAction === scen.action ? 'scen-loading' : ''} ${successAction === scen.action ? 'scen-success' : ''}`}
                            style={{ '--btn-color': scen.color }}
                        >
                            <div className="scen-icon-container">
                                {loadingAction === scen.action ? <Loader2 className="animate-spin" size={18} /> : scen.icono}
                            </div>
                            <div className="scen-text">
                                <span className="scen-label">{scen.label}</span>
                                <span className="scen-desc">{scen.desc}</span>
                            </div>
                            {successAction === scen.action && <CheckCircle2 className="scen-check" size={16} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="panel-footer mt-auto">
                <div className="link-status">
                    <div className="pulse-green" />
                    <span>ENCRYPTED LINK STABLE</span>
                </div>
                <button className="settings-btn">
                    <Settings size={16} />
                </button>
            </div>
        </div>
    )
}
