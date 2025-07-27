import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'

function ShieldModel() {
  const meshRef = useRef<Group>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const gltf = useGLTF('/3d_shield_icon.glb')
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  useFrame(() => {
    if (meshRef.current) {
      const targetRotationY = mousePosition.x * Math.PI * 0.3
      const targetRotationX = mousePosition.y * Math.PI * 0.2
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05
      meshRef.current.position.y = -9 + Math.sin(Date.now() * 0.002) * 0.5
    }
  })
  
  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material.emissive.setHex(0x004d3d)
          child.material.emissiveIntensity = 0.7
          child.material.roughness = 0.3 
          child.material.metalness = 1.4 
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])
  
  return (
    <group ref={meshRef} scale={[8.4, 8.4, 8.4]}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export default function Shield3D() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: '100%', height: '32rem', minHeight: '28rem', overflow: 'visible' }}
    >
      <Canvas
        camera={{ position: [0, -1.5, 20], fov: 80 }}
        className="!block"
        style={{ width: '400%', height: '150%', overflow: 'visible', pointerEvents: 'auto' }}
        shadows
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffbf" />
        <pointLight 
          position={[0, -5, 15]} 
          intensity={0.8} 
          color="#00ffbf"
          distance={25}
          decay={1.5}
        />
        <ShieldModel />
      </Canvas>
      
      {/* Glow Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
        <div className="w-[20rem] h-[20rem] bg-cyber-glow opacity-15 rounded-full blur-3xl animate-cyber-pulse" />
        <div className="absolute w-[14rem] h-[14rem] bg-cyber-glow opacity-20 rounded-full blur-2xl" />
        <div className="absolute w-[8rem] h-[8rem] bg-cyber-glow opacity-25 rounded-full blur-xl" />
      </div>
    </div>
  )
}
