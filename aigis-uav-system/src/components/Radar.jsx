import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Sphere, MeshDistortMaterial, Trail, Points, PointMaterial, Line, Html } from '@react-three/drei'
import * as THREE from 'three'

const COLOR_MAP = [
  { h: -4, c: '#00ff44' }, // Low
  { h: -1, c: '#aaff00' },
  { h: 1, c: '#ffff00' },  // Mid
  { h: 3, c: '#ffaa00' },
  { h: 5, c: '#ff0000' }   // High
]

function getTerrainColor(height) {
  for (let i = 0; i < COLOR_MAP.length - 1; i++) {
    if (height <= COLOR_MAP[i + 1].h) {
      return new THREE.Color(COLOR_MAP[i].c)
    }
  }
  return new THREE.Color(COLOR_MAP[COLOR_MAP.length - 1].c)
}

function Terrain({ state }) {
  const mesh = useRef()

  // High-fidelity Topographical Mesh
  const { geometry, colors } = useMemo(() => {
    const segments = 64 // Higher density for detail
    const geo = new THREE.PlaneGeometry(120, 120, segments, segments)
    const vertices = geo.attributes.position.array
    const colorsArr = new Float32Array(vertices.length)

    const seed = state === 'SCANNING' ? Math.random() * 100 : 42

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]

      // Layered Noise for realistic topographical features
      const height =
        Math.sin(x * 0.05 + seed) * Math.cos(y * 0.05 + seed) * 5 +
        Math.sin(x * 0.15) * Math.sin(y * 0.15) * 2 +
        Math.cos(x * 0.3) * 0.5;

      vertices[i + 2] = height

      const color = getTerrainColor(height)
      colorsArr[i] = color.r
      colorsArr[i + 1] = color.g
      colorsArr[i + 2] = color.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3))
    geo.computeVertexNormals()
    return { geometry: geo, colors: colorsArr }
  }, [state === 'SCANNING'])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      {/* Dynamic Elevation Model */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors={true}
          flatShading={true}
          transparent
          opacity={0.9}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Tactical Grid Lines */}
      <mesh geometry={geometry} position={[0, 0, 0.02]}>
        <meshBasicMaterial
          color="#000000"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* 3D Topographical Legend */}
      <Html position={[-70, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <div className="terrain-legend">
          <div className="legend-title">ALTITUDE SCALE (m)</div>
          <div className="legend-gradient">
            <div className="legend-labels">
              <span>1098m</span>
              <span>1050m</span>
              <span>1000m</span>
            </div>
            <div className="gradient-bar" />
          </div>
        </div>
      </Html>
    </group>
  )
}

function DroneModel({ state, position }) {
  const rotorsRef = useRef([])

  useFrame((state_frame) => {
    rotorsRef.current.forEach((rotor, i) => {
      if (rotor) {
        rotor.rotation.y += 0.8 // High-speed rotor rotation
      }
    })
  })

  const color = state === 'EMERGENCY' ? '#ff0000' : '#00f2ff'

  return (
    <group position={position}>
      {/* Central Tactical Body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 2]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.5]} castShadow>
        <boxGeometry args={[0.8, 0.3, 1]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Arms (X-Config) */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, z], i) => (
        <group key={i} position={[x * 1.2, 0, z * 1.2]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 1.8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Rotors / Propellers */}
          <mesh ref={el => rotorsRef.current[i] = el} position={[0, 0.2, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.1]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      ))}

      {/* Navigation Lights */}
      <pointLight color={color} intensity={5} distance={10} />
      <mesh position={[0, 0, 1.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

function Scene({ dronePosition, targets, state }) {
  const scannerRef = useRef()

  useFrame((state_frame) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y += 0.015
      if (state === 'SCANNING' || state === 'SEARCHING') {
        const s = 1 + Math.sin(state_frame.clock.elapsedTime * 4) * 0.05
        scannerRef.current.scale.set(s, s, s)
      }
    }
  })

  return (
    <>
      <color attach="background" args={['#030508']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 50, 10]} intensity={2} color="#ffffff" />
      <directionalLight position={[0, 100, 0]} intensity={0.5} />

      <Terrain state={state} />

      {/* Radar Main Grid */}
      <Grid
        infiniteGrid
        fadeDistance={100}
        fadeStrength={15}
        sectionSize={5}
        sectionColor="#ffffff"
        sectionThickness={0.5}
        cellSize={1}
        cellColor="#333333"
        cellThickness={0.2}
        position={[0, -4.9, 0]}
      />

      {/* UAV Tactical Asset with Trail */}
      <Trail
        width={1.2}
        length={25}
        color={state === 'EMERGENCY' ? '#ff0000' : '#00f2ff'}
        attenuation={(t) => t * t}
      >
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
          <DroneModel
            state={state}
            position={[dronePosition.x, dronePosition.y / 20, dronePosition.z]}
          />
        </Float>
      </Trail>

      {/* Detected Targets */}
      {targets.map((target) => (
        <group key={target.id} position={[target.x, -2, target.z]}>
          <Sphere args={[0.4, 16, 16]}>
            <meshBasicMaterial color={target.detected ? (target.priority === 'CRITICAL' ? "#ff0000" : "#ffcc00") : "#222"} />
          </Sphere>

          {target.detected && (
            <Line
              points={[[0, 0, 0], [dronePosition.x - target.x, (dronePosition.y / 20) + 2, dronePosition.z - target.z]]}
              color="#ffcc00"
              lineWidth={1}
              transparent
              opacity={0.5}
            />
          )}
        </group>
      ))}

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </>
  )
}

export default function Radar({ dronePosition, targets, state }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas shadows camera={{ position: [40, 40, 40], fov: 45 }}>
        <Scene dronePosition={dronePosition} targets={targets || []} state={state} />
        <fog attach="fog" args={['#030508', 50, 150]} />
      </Canvas>
    </div>
  )
}

