import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Scene({ dronePosition }) {
  const scannerRef = useRef()

  useFrame((state) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y += 0.02
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
      
      {/* Radar Grid */}
      <Grid
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
        sectionSize={1.5}
        sectionColor="#00f2ff"
        sectionThickness={1.5}
        cellSize={0.5}
        cellColor="#0a0b10"
        cellThickness={1}
      />

      {/* Scanner Effect */}
      <mesh ref={scannerRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial 
          color="#00f2ff" 
          transparent 
          opacity={0.05} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Drone Representation */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[dronePosition.x, dronePosition.y, dronePosition.z]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} />
          
          {/* Engine Glows */}
          <pointLight color="#00f2ff" intensity={2} distance={2} />
          
          {/* Signal Pulse */}
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <MeshDistortMaterial
              color="#00f2ff"
              transparent
              opacity={0.2}
              speed={2}
              distort={0.4}
              radius={1}
            />
          </mesh>
        </mesh>
      </Float>

      {/* Terrain Indicators (Simulated Targets) */}
      <Sphere args={[0.1, 16, 16]} position={[5, 0, 5]}>
        <meshBasicMaterial color="#ff4d4d" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[-3, 0, -6]}>
        <meshBasicMaterial color="#ff4d4d" />
      </Sphere>

      <OrbitControls makeDefault minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.1} />
    </>
  )
}

export default function Radar({ dronePosition }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
        <Scene dronePosition={dronePosition} />
        <fog attach="fog" args={['#0a0b10', 10, 50]} />
      </Canvas>
    </div>
  )
}
