import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Luxury3DObject() {
  const knotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (knotRef.current) {
      knotRef.current.rotation.x = t * 0.15;
      knotRef.current.rotation.y = t * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = -t * 0.1;
      ringRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group position={[1.5, 0, 0]}>
      {/* Central Luxury Gold Torus Knot */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[1.3, 0.38, 128, 32]} />
          <MeshDistortMaterial
            color="#d4af37"
            speed={2}
            distort={0.25}
            radius={1}
            roughness={0.1}
            metalness={0.95}
            emissive="#3d3100"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Orbiting Neon Cyan & White Ring */}
      <Float speed={3} rotationIntensity={1.2} floatIntensity={1.2}>
        <mesh ref={ringRef}>
          <torusGeometry args={[2.3, 0.025, 16, 100]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.8} roughness={0.1} transparent opacity={0.7} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle Grid Background with Gold/Neon hints */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#d4af37" />
        <Luxury3DObject />
      </Canvas>
    </div>
  );
}