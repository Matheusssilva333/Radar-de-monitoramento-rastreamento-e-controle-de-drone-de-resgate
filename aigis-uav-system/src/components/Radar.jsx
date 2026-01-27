import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Sphere, MeshDistortMaterial, Trail, Points, PointMaterial, Line, Html } from '@react-three/drei'
import * as THREE from 'three'

function Terrain() {
  const mesh = useRef()

  // Create a stylized low-poly terrain as requested
  const geometry = useMemo(() => {
    // Reduced segments for that low-poly visual from the user image
    const geo = new THREE.PlaneGeometry(120, 120, 32, 32)
    const vertices = geo.attributes.position.array
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]

      // More organic noise using multiple frequencies
      const height =
        Math.sin(x * 0.08) * Math.cos(y * 0.08) * 4 +
        Math.sin(x * 0.2) * Math.sin(y * 0.2) * 1.5 +
        (Math.random() - 0.5) * 0.2; // Tiny bit of jitter for that raw look

      vertices[i + 2] = height
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      {/* Solid Surface with Flat Shading */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#ffffff"
          flatShading={true}
          transparent
          opacity={0.8}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>

      {/* Tactical Wireframe Overlay */}
      <mesh geometry={geometry} position={[0, 0, 0.05]}>
        <meshBasicMaterial
          color="#00f2ff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

function Scene({ dronePosition, targets }) {
  const scannerRef = useRef()

  useFrame((state) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y += 0.015
    }
  })

  return (
    <>
      <color attach="background" args={['#030508']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 20, 10]} intensity={2} color="#00f2ff" />
      <spotLight position={[0, 50, 0]} angle={0.5} penumbra={1} intensity={2} castShadow />

      <Terrain />

      {/* Radar Main Grid */}
      <Grid
        infiniteGrid
        fadeDistance={100}
        fadeStrength={10}
        sectionSize={5}
        sectionColor="#00f2ff"
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
          color="#00f2ff"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
        {/* Border ring */}
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[14.8, 15, 64]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.2} />
        </mesh>
      </mesh>

      {/* Drone with Trail */}
      <Trail
        width={1.5}
        length={10}
        color={'#00f2ff'}
        attenuation={(t) => t * t}
      >
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[dronePosition.x, dronePosition.y / 20, dronePosition.z]}>
            <octahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#00f2ff"
              emissiveIntensity={5}
            />

            <pointLight color="#00f2ff" intensity={5} distance={10} />

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
            <meshBasicMaterial color={target.detected ? (target.priority === 'CRITICAL' ? "#ff0000" : "#ff2e63") : "#444"} transparent opacity={0.8} />
          </Sphere>

          {target.detected && (
            <>
              <pointLight color="#ff2e63" intensity={2} distance={5} />

              {/* Tactical Connection Line */}
              <Line
                points={[[0, 0, 0], [dronePosition.x - target.x, (dronePosition.y / 20) + 1.5, dronePosition.z - target.z]]}
                color="#ff2e63"
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

export default function Radar({ dronePosition, targets }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas shadows camera={{ position: [20, 20, 20], fov: 45 }}>
        <Scene dronePosition={dronePosition} targets={targets || []} />
        <fog attach="fog" args={['#030508', 30, 90]} />
      </Canvas>
    </div>
  )
}
