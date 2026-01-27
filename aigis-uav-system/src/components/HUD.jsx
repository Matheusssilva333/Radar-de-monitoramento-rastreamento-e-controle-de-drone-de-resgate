import React from 'react'
import { Activity, Battery, Signal, Navigation, Shield, Zap, Wind, Ruler, Target } from 'lucide-react'

export default function HUD({ droneStatus, aiMessages, position }) {
    return (
        <div className="hud-container" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2.5rem',
            zIndex: 10
        }}>
            {/* Top Bar: Mission Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="glass-panel" style={{ padding: '1.2rem', width: '320px', pointerEvents: 'auto', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                            UAV // {droneStatus.state || 'IDLE'}
                        </span>
                        <div style={{ width: '8px', height: '8px', background: droneStatus.state === 'EMERGENCY' ? 'var(--danger)' : 'var(--success)', borderRadius: '50%', boxShadow: `0 0 10px ${droneStatus.state === 'EMERGENCY' ? 'var(--danger)' : 'var(--success)'}` }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        <StatItem icon={<Battery size={14} />} label="BAT" value={`${droneStatus.battery}%`} color={droneStatus.battery < 20 ? 'var(--danger)' : 'var(--success)'} />
                        <StatItem icon={<Activity size={14} />} label="HW_LINK" value={droneStatus.hardware_link ? "MAVLINK" : "SIM_MODE"} color={droneStatus.hardware_link ? 'var(--success)' : 'var(--warning)'} />
                        <StatItem icon={<Navigation size={14} />} label="NAV" value="GNSS-HIGH" />
                        <StatItem icon={<Signal size={14} />} label="CPU" value="12%" />
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ color: 'white', fontWeight: '900', fontSize: '2.5rem', letterSpacing: '6px', margin: 0 }}>AIGIS <span className="glow-text" style={{ color: 'var(--primary)' }}>TACTICAL</span></h1>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(0, 242, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>GEMINI 3 FLASH ACTIVE</span>
                        <span style={{ fontSize: '0.7rem', color: 'white', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>SECURE CHANNEL</span>
                    </div>
                </div>
            </div>

            {/* Middle Center: Tactical Crosshair */}
            <div style={{ alignSelf: 'center', position: 'relative' }}>
                <div style={{
                    width: '300px',
                    height: '200px',
                    border: '1px solid var(--border)',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0.5
                }}>
                    <div style={{ position: 'absolute', top: 0, left: '50%', height: '10px', width: '1px', background: 'var(--primary)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: '50%', height: '10px', width: '1px', background: 'var(--primary)' }} />
                    <div style={{ position: 'absolute', left: 0, top: '50%', width: '10px', height: '1px', background: 'var(--primary)' }} />
                    <div style={{ position: 'absolute', right: 0, top: '50%', width: '10px', height: '1px', background: 'var(--primary)' }} />

                    <div className="glow-text" style={{ fontSize: '0.6rem', color: 'var(--primary)', position: 'absolute', top: '-20px' }}>TARGET LOCK: AUTO</div>
                </div>
            </div>

            {/* Bottom Bar: AI Intel & Telemetry */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
                <div className="glass-panel" style={{ padding: '1.2rem', width: '400px', height: '220px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Zap size={18} className="scanning" />
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>AI ANALYTICS LOG</span>
                    </div>
                    <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
                        {aiMessages.map((msg, i) => (
                            <div key={i} style={{
                                fontSize: '0.8rem',
                                color: i === 0 ? 'white' : 'rgba(255,255,255,0.4)',
                                borderLeft: `2px solid ${i === 0 ? 'var(--primary)' : 'transparent'}`,
                                paddingLeft: '10px',
                                transition: 'all 0.3s ease'
                            }}>
                                <span style={{ color: 'var(--primary)', fontSize: '0.7rem', fontFamily: 'JetBrains Mono', display: 'block' }}>
                                    TRACKING_RES_{100 - i}:
                                </span>
                                {msg}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.2rem', width: '350px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                        <TelemetryItem icon={<Ruler size={14} />} label="ALTITUDE" value={`${(droneStatus.altitude || 0).toFixed(1)}m`} />
                        <TelemetryItem icon={<Wind size={14} />} label="VELOCITY" value={`${(droneStatus.velocity || 0).toFixed(1)}km/h`} />
                        <TelemetryItem icon={<Target size={14} />} label="POS_X" value={(position?.x || 0).toFixed(2)} />
                        <TelemetryItem icon={<Target size={14} />} label="POS_Z" value={(position?.z || 0).toFixed(2)} />
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.7rem', opacity: 0.6, fontFamily: 'JetBrains Mono' }}>
                        MT: {Math.floor((droneStatus.mission_time || 0) / 60)}m {Math.floor((droneStatus.mission_time || 0) % 60)}s
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatItem({ icon, label, value, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: color || 'var(--primary)', opacity: 0.8 }}>{icon}</span>
            <span style={{ opacity: 0.5, fontSize: '0.65rem' }}>{label}</span>
            <span style={{ color: color || 'white', fontWeight: 'bold', marginLeft: 'auto' }}>{value}</span>
        </div>
    )
}

function TelemetryItem({ icon, label, value }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: 'var(--primary)', opacity: 0.6 }}>{icon}</span>
                <span style={{ fontSize: '0.6rem', opacity: 0.5, letterSpacing: '1px' }}>{label}</span>
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', fontFamily: 'JetBrains Mono' }}>{value}</span>
        </div>
    )
}
