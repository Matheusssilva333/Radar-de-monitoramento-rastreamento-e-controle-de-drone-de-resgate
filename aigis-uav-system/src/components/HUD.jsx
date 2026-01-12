import React from 'react'
import { Activity, Battery, Signal, Navigation, Shield, Zap } from 'lucide-react'

export default function HUD({ droneStatus, aiMessages }) {
    return (
        <div className="hud-container" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
            zIndex: 10
        }}>
            {/* Top Bar: Mission Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="glass-panel" style={{ padding: '1rem', width: '300px', pointerEvents: 'auto' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem', letterSpacing: '2px' }} className="glow-text">
                        SYSTEM STATUS: OPERATIONAL
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <StatItem icon={<Battery size={14} />} label="BATTERY" value={`${droneStatus.battery}%`} color={droneStatus.battery < 20 ? 'var(--danger)' : 'var(--success)'} />
                        <StatItem icon={<Signal size={14} />} label="SIGNAL" value={`${droneStatus.signal}dBm`} />
                        <StatItem icon={<Navigation size={14} />} label="GPS" value="FIXED" />
                        <StatItem icon={<Activity size={14} />} label="LINK" value="ENCRYPTED" />
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ color: 'white', fontWeight: '900', fontSize: '2rem', letterSpacing: '4px' }}>AIGIS <span style={{ color: 'var(--primary)' }}>UAV</span></h1>
                    <p style={{ color: 'var(--primary)', fontSize: '0.8rem', opacity: 0.8 }}>RESCUE RADAR v2.0 // GEMINI PRO</p>
                </div>
            </div>

            {/* Middle Center: Aim/Crosshair simulated */}
            <div style={{ alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    border: '1px solid var(--primary-glow)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0.3
                }}>
                    <div style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%' }} />
                </div>
            </div>

            {/* Bottom Bar: AI Intel & Telemetry */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
                <div className="glass-panel" style={{ padding: '1rem', width: '350px', maxHeight: '200px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Zap size={18} />
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>GEMINI INTELLIGENCE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {aiMessages.map((msg, i) => (
                            <p key={i} style={{ fontSize: '0.85rem', color: i === 0 ? 'white' : 'rgba(255,255,255,0.6)', borderLeft: '2px solid var(--primary)', paddingLeft: '8px' }}>
                                <span style={{ color: 'var(--primary)', marginRight: '5px' }}>[{new Date().toLocaleTimeString()}]</span>
                                {msg}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', width: '300px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <TelemetryItem label="ALTITUDE" value={`${droneStatus.altitude}m`} />
                        <TelemetryItem label="VELOCITY" value={`${droneStatus.velocity}km/h`} />
                        <TelemetryItem label="LAT" value={droneStatus.lat.toFixed(6)} />
                        <TelemetryItem label="LNG" value={droneStatus.lng.toFixed(6)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatItem({ icon, label, value, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
            <span style={{ color: color || 'var(--primary)' }}>{icon}</span>
            <span style={{ opacity: 0.7 }}>{label}:</span>
            <span style={{ color: color || 'white', fontWeight: 'bold' }}>{value}</span>
        </div>
    )
}

function TelemetryItem({ label, value }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', opacity: 0.6, letterSpacing: '1px' }}>{label}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{value}</span>
        </div>
    )
}
