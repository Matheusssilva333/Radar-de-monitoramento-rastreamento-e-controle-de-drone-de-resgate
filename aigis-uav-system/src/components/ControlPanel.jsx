import React from 'react'
import { Play, Square, Home, AlertTriangle, Crosshair, Map } from 'lucide-react'

export default function ControlPanel({ onCommand }) {
    const controls = [
        { label: 'TAKEOFF', icon: <Play size={18} />, action: 'takeoff', color: 'var(--success)' },
        { label: 'LAND', icon: <Square size={18} />, action: 'land', color: 'var(--text)' },
        { label: 'RTL', icon: <Home size={18} />, action: 'rtl', color: 'var(--primary)' },
        { label: 'SCAN', icon: <Crosshair size={18} />, action: 'scan', color: 'var(--primary)' },
        { label: 'MISSION', icon: <Map size={18} />, action: 'mission', color: 'var(--primary)' },
        { label: 'EMERGENCY', icon: <AlertTriangle size={18} />, action: 'emergency', color: 'var(--danger)' },
    ]

    return (
        <div style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 20
        }}>
            {controls.map((ctrl) => (
                <button
                    key={ctrl.action}
                    onClick={() => onCommand(ctrl.action)}
                    className="glass-panel"
                    style={{
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        border: `1px solid ${ctrl.color}33`,
                        transition: 'all 0.2s ease',
                        color: ctrl.color,
                        pointerEvents: 'auto'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${ctrl.color}22`
                        e.currentTarget.style.borderColor = ctrl.color
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--card-bg)'
                        e.currentTarget.style.borderColor = `${ctrl.color}33`
                    }}
                >
                    {ctrl.icon}
                    <span style={{ fontSize: '0.5rem', marginTop: '4px', fontWeight: 'bold' }}>{ctrl.label}</span>
                </button>
            ))}
        </div>
    )
}
