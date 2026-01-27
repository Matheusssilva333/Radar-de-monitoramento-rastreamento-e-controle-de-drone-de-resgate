import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Sphere, MeshDistortMaterial, Trail, Points, PointMaterial, Line, Html } from '@react-three/drei'
import * as THREE from 'three'

function Terrain({ state }) {
  const mesh = useRef()

  // Dynamic tactical terrain
  const geometry = useMemo(() => {
    const segments = 32
    const geo = new THREE.PlaneGeometry(120, 120, segments, segments)
    const vertices = geo.attributes.position.array

    // Use the state as a seed for different terrain generation
    const seed = state === 'SCANNING' ? Math.random() : 0.5

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]

      const height =
        Math.sin(x * 0.08 + seed) * Math.cos(y * 0.08 + seed) * 4 +
        Math.sin(x * 0.2) * Math.sin(y * 0.2) * 1.5;

      vertices[i + 2] = height
    }
    geo.computeVertexNormals()
    return geo
  }, [state === 'SCANNING']) // Regenerate purely on scanning trigger

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={state === 'EMERGENCY' ? '#301010' : '#ffffff'}
          flatShading={true}
          transparent
          opacity={0.8}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>

      <mesh geometry={geometry} position={[0, 0, 0.05]}>
        <meshBasicMaterial
          color={state === 'SCANNING' ? "#00ffaa" : "#00f2ff"}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

function Scene({ dronePosition, targets, state }) {
  const scannerRef = useRef()

  useFrame((state_frame) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y += 0.015
      // Pulsing scale for better visibility during scan
      if (state === 'SCANNING' || state === 'SEARCHING') {
        const s = 1 + Math.sin(state_frame.clock.elapsedTime * 4) * 0.05
        scannerRef.current.scale.set(s, s, s)
      } else {
        scannerRef.current.scale.set(1, 1, 1) // Reset scale when not scanning/searching
      }
    }
  })

  return (
    <>
      <color attach="background" args={['#030508']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 20, 10]} intensity={2} color="#00f2ff" />
      <spotLight position={[0, 50, 0]} angle={0.5} penumbra={1} intensity={2} castShadow />

      <Terrain state={state} />

      {/* Radar Main Grid */}
      <Grid
        infiniteGrid
        fadeDistance={100}
        fadeStrength={10}
        sectionSize={5}
        sectionColor={state === 'EMERGENCY' ? "#ff0000" : "#00f2ff"}
        sectionThickness={1}
        cellSize={1}
        cellColor="#004455"
        cellThickness={0.5}
        position={[0, -1.9, 0]}
      />

      {/* Pulsing Scanner Effect */}
      <mesh ref={scannerRef} rotation={[-Math.PI / 2, 0, 0]} position={[dronePosition.x, 0.1, dronePosition.z]}>
        <circleGeometry args={[15, 64]} />
        <meshBasicMaterial
          color={state === 'SCANNING' ? "#00ffaa" : "#00f2ff"}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
        {/* Border ring */}
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[14.8, 15, 64]} />
          <meshBasicMaterial color={state === 'SCANNING' ? "#00ffaa" : "#00f2ff"} transparent opacity={0.2} />
        </mesh>
      </mesh>

      {/* Drone with Trail */}
      <Trail
        width={1.5}
        length={15}
        color={state === 'EMERGENCY' ? '#ff0000' : '#00f2ff'}
        attenuation={(t) => t * t}
      >
        <Float speed={state === 'FLYING' ? 4 : 2} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[dronePosition.x, dronePosition.y / 20, dronePosition.z]}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={state === 'EMERGENCY' ? '#ff0000' : '#00f2ff'}
              emissiveIntensity={5}
            />

            <pointLight color={state === 'EMERGENCY' ? '#ff0000' : '#00f2ff'} intensity={5} distance={10} />

            {/* Visual altitude connector */}
            <mesh position={[0, -dronePosition.y / 40, 0]}>
              <cylinderGeometry args={[0.02, 0.02, dronePosition.y / 20, 8]} />
              <meshBasicMaterial color="#00f2ff" transparent opacity={0.2} />
            </mesh>
          </mesh>
        </Float>
      </Trail>

      {/* Detected Targets */}
      {targets.map((target) => (
        <group key={target.id} position={[target.x, -1.5, target.z]}>
          <Sphere args={[target.detected ? 0.3 : 0.15, 16, 16]}>
            <meshBasicMaterial color={target.detected ? (target.priority === 'CRITICAL' ? "#ff0000" : "#ffcc00") : "#222"} transparent opacity={0.8} />
          </Sphere>

          {target.detected && (
            <>
              <pointLight color="#ffcc00" intensity={2} distance={5} />

              {/* Tactical Connection Line */}
              <Line
                points={[[0, 0, 0], [dronePosition.x - target.x, (dronePosition.y / 20) + 1.5, dronePosition.z - target.z]]}
                color={target.priority === 'CRITICAL' ? "#ff0000" : "#ffcc00"}
                lineWidth={1}
                transparent
                opacity={0.3}
              />

              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 0.7, 32]} />
                <meshBasicMaterial color="#ff2e63" transparent opacity={0.2} />
              </mesh>

              <Html position={[0, 1, 0]} center>
                <div style={{
                  background: 'rgba(255, 46, 99, 0.2)',
                  border: '1px solid #ff2e63',
                  color: 'white',
                  padding: '2px 6px',
                  fontSize: '0.6rem',
                  fontFamily: 'JetBrains Mono',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(4px)'
                }}>
                  {target.type}: {target.priority}
                </div>
              </Html>
            </>
          )}
        </group>
      ))}

      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

export default function Radar({ dronePosition, targets, state }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas shadows camera={{ position: [25, 25, 25], fov: 45 }}>
        <Scene dronePosition={dronePosition} targets={targets || []} state={state} />
        <fog attach="fog" args={['#030508', 30, 100]} />
      </Canvas>
    </div>
  )
}
