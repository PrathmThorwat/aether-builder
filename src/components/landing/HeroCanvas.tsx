import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

function StudioSculpture() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.42,
        2.6,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.26,
        2.6,
        delta
      );
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.14;
      coreRef.current.rotation.x += delta * 0.06;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * (0.18 + Math.sin(t * 0.35) * 0.04);
      wireRef.current.rotation.z = Math.sin(t * 0.22) * 0.2;
    }
    if (ringARef.current) {
      ringARef.current.rotation.z += delta * 0.12;
      ringARef.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.28) * 0.08;
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.z -= delta * 0.09;
      ringBRef.current.rotation.x = Math.PI / 1.85 + Math.cos(t * 0.22) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.15, 0]} scale={1.02}>
      <Float speed={1.15} rotationIntensity={0.35} floatIntensity={0.9}>
        <mesh ref={coreRef} castShadow>
          <dodecahedronGeometry args={[1.48, 0]} />
          <meshPhysicalMaterial
            color="#e7edf5"
            metalness={0.58}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.18}
            envMapIntensity={1.35}
            reflectivity={0.7}
          />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.55} floatIntensity={1.05}>
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[2.24, 1]} />
          <meshBasicMaterial color="#2563eb" wireframe transparent opacity={0.11} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.7} floatIntensity={1.1}>
        <mesh ref={ringARef} rotation={[Math.PI / 2.4, 0.4, 0]}>
          <torusGeometry args={[2.62, 0.009, 8, 180]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.42} />
        </mesh>
      </Float>

      <Float speed={2.3} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh ref={ringBRef} rotation={[Math.PI / 1.85, -0.6, 0.3]}>
          <torusGeometry args={[2.95, 0.006, 8, 180]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

function StudioRig() {
  return (
    <Environment resolution={256}>
      <Lightformer
        form="rect"
        intensity={2.4}
        position={[0, 5, -6]}
        scale={[10, 5, 1]}
        color="#ffffff"
      />
      <Lightformer
        form="rect"
        intensity={1.5}
        position={[-6, 2, 2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[6, 6, 1]}
        color="#dbeafe"
      />
      <Lightformer
        form="rect"
        intensity={1.2}
        position={[6, 1, 1]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[6, 6, 1]}
        color="#f1f5f9"
      />
    </Environment>
  );
}

export default function HeroCanvas() {
  return (
    <div className="relative h-[340px] w-full cursor-grab active:cursor-grabbing sm:h-[440px] lg:h-[560px]">
      <Canvas
        camera={{ position: [0, 0, 7.4], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
        shadows
      >
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#ffffff', '#cbd5e1', 0.8]} />
        <directionalLight position={[6, 8, 6]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-6, 3, -4]} intensity={0.8} color="#dbeafe" />
        <StudioRig />
        <StudioSculpture />
        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.22}
          scale={11}
          blur={3}
          far={4.5}
          color="#0f172a"
        />
      </Canvas>
    </div>
  );
}
