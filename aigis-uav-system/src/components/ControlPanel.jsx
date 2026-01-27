import React from 'react'
import { Play, Square, Home, AlertTriangle, Crosshair, Map, Zap, Settings } from 'lucide-react'

export default function ControlPanel({ onCommand }) {
    const controls = [
        { label: 'TAKEOFF', icon: <Play size={20} />, action: 'takeoff', color: 'var(--success)' },
        { label: 'SCAN', icon: <Crosshair size={20} />, action: 'scan', color: 'var(--primary)' },
        { label: 'MISSION', icon: <Map size={20} />, action: 'mission', color: 'var(--primary)' },
        { label: 'RTL', icon: <Home size={20} />, action: 'rtl', color: 'var(--warning)' },
        { label: 'LAND', icon: <Square size={20} />, action: 'land', color: 'var(--text)' },
        { label: 'EMERGENCY', icon: <AlertTriangle size={20} />, action: 'emergency', color: 'var(--danger)' },
    ]

    return (
        <div style={{
            position: 'absolute',
            right: '2.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            zIndex: 20
        }}>
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--primary)', opacity: 0.6, letterSpacing: '2px', fontWeight: 'bold' }}>MANUAL CTRL</div>
                <div style={{ width: '100%', height: '1px', background: 'var(--border)', marginTop: '5px' }} />
            </div>

            {controls.map((ctrl) => (
                <button
                    key={ctrl.action}
                    onClick={() => onCommand(ctrl.action)}
                    className="glass-panel"
                    style={{
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        border: `1px solid ${ctrl.color}44`,
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        color: ctrl.color,
                        pointerEvents: 'auto',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1) translateX(-5px)'
                        e.currentTarget.style.boxShadow = `0 0 20px ${ctrl.color}33`
                        e.currentTarget.style.borderColor = ctrl.color
                        e.currentTarget.style.background = `${ctrl.color}11`
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) translateX(0)'
                        e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
                        e.currentTarget.style.borderColor = `${ctrl.color}44`
                        e.currentTarget.style.background = 'var(--card-bg)'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>{ctrl.icon}</div>
                    <span style={{ fontSize: '0.5rem', marginTop: '6px', fontWeight: '800', letterSpacing: '0.5px', position: 'relative', zIndex: 1 }}>{ctrl.label}</span>

                    {/* Inner pulse effect for emergency */}
                    {ctrl.action === 'emergency' && (
                        <div className="scanning" style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(255,46,99,0.05)', top: 0, left: 0 }} />
                    )}
                </button>
            ))}

            <button className="glass-panel" style={{ width: '64px', height: '64px', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border)', pointerEvents: 'auto', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                <Settings size={20} />
            </button>
        </div>
    )
}
