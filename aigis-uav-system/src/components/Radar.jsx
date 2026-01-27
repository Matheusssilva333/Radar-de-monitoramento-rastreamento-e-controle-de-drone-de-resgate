import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Sphere, MeshDistortMaterial, Trail, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Terrain() {
  const mesh = useRef()

  // Create a stylized hilly terrain
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 50, 50)
    const vertices = geo.attributes.position.array
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      // Simplex noise would be better, but this trig-based noise works for a tech look
      vertices[i + 2] = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2 +
        Math.sin(x * 0.5) * 0.5
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <meshStandardMaterial
        color="#050a15"
        wireframe
        transparent
        opacity={0.3}
        emissive="#00f2ff"
        emissiveIntensity={0.1}
      />
    </mesh>
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
          <Sphere args={[0.2, 16, 16]}>
            <meshBasicMaterial color={target.detected ? "#ff2e63" : "#444"} />
          </Sphere>
          {target.detected && (
            <>
              <pointLight color="#ff2e63" intensity={2} distance={5} />
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.4, 0.5, 32]} />
                <MeshDistortMaterial
                  color="#ff2e63"
                  speed={5}
                  distort={0.3}
                  radius={1}
                />
              </mesh>
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
