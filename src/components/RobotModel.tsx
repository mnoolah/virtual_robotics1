import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { robotParts } from '../data/robotParts'

const metal = { color: '#e8e2e6', metalness: 0.25, roughness: 0.4 }
const dark = { color: '#2c2733', metalness: 0.2, roughness: 0.5 }
const accent = { color: '#8b2f5e', metalness: 0.2, roughness: 0.4 }

type Props = {
  activePart: string | null
  onSelect: (id: string) => void
}

export function RobotModel({ activePart, onSelect }: Props) {
  const group = useRef<THREE.Group>(null)
  const eyeGlow = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useFrame((state) => {
    if (group.current) {
      // idle "breathing" bob only — rotation is left entirely to the user via OrbitControls
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04
    }
    if (eyeGlow.current) {
      const m = eyeGlow.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 1.4 + Math.sin(state.clock.elapsedTime * 3) * 0.4
    }
  })

  const hoverHandlers = (id: string) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      setHovered(id)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      setHovered((h) => (h === id ? null : h))
      document.body.style.cursor = 'auto'
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      onSelect(id)
    },
  })

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* head / processor */}
      <group position={[0, 1.55, 0]} {...hoverHandlers('processor')}>
        <mesh castShadow {...pulse(activePart === 'processor', hovered === 'processor')}>
          <boxGeometry args={[0.62, 0.5, 0.6]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0, 0, 0.31]}>
          <boxGeometry args={[0.4, 0.14, 0.02]} />
          <meshStandardMaterial {...accent} emissive="#8b2f5e" emissiveIntensity={0.6} />
        </mesh>
        {/* antenna */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, 0.54, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#d1495b" emissive="#d1495b" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* eye / sensor */}
      <mesh
        ref={eyeGlow}
        position={[0.32, 1.48, 0.62]}
        {...hoverHandlers('sensor-eye')}
        {...pulse(activePart === 'sensor-eye', hovered === 'sensor-eye')}
      >
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#3a8fb7" emissive="#3a8fb7" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[-0.32, 1.48, 0.62]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#3a8fb7" emissive="#3a8fb7" emissiveIntensity={1.2} />
      </mesh>

      {/* neck */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.16, 12]} />
        <meshStandardMaterial {...dark} />
      </mesh>

      {/* torso */}
      <mesh castShadow position={[0, 0.78, 0]}>
        <boxGeometry args={[0.72, 0.7, 0.5]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0.9, 0.26]}>
        <ringGeometry args={[0.1, 0.14, 32]} />
        <meshStandardMaterial color="#4a7c59" emissive="#4a7c59" emissiveIntensity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* battery pack (back) */}
      <mesh
        position={[0, 0.55, -0.3]}
        {...hoverHandlers('battery')}
        {...pulse(activePart === 'battery', hovered === 'battery')}
      >
        <boxGeometry args={[0.4, 0.28, 0.12]} />
        <meshStandardMaterial color="#4a7c59" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* right arm */}
      <group position={[0.5, 1.05, 0]} {...hoverHandlers('arm')}>
        <mesh {...pulse(activePart === 'arm', hovered === 'arm')}>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 12]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0, -0.35, 0.18]} rotation={[0.9, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, -0.55, 0.4]}>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial {...accent} />
        </mesh>
      </group>
      <mesh
        position={[0.5, 1.28, 0]}
        {...hoverHandlers('servo')}
        {...pulse(activePart === 'servo', hovered === 'servo')}
      >
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#c98a2c" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* left arm */}
      <group position={[-0.5, 1.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 12]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0, -0.35, 0.18]} rotation={[0.9, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, -0.55, 0.4]}>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial {...accent} />
        </mesh>
      </group>
      <mesh position={[-0.5, 1.28, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#c98a2c" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* hips */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.5, 0.18, 0.4]} />
        <meshStandardMaterial {...dark} />
      </mesh>

      {/* legs / wheels base */}
      <group position={[0, 0, 0]} {...hoverHandlers('base')}>
        <mesh position={[0.18, 0.05, 0]} {...pulse(activePart === 'base', hovered === 'base')}>
          <cylinderGeometry args={[0.11, 0.11, 0.28, 16]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[-0.18, 0.05, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.28, 16]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.42, 0.46, 0.16, 24]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0.4, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.06, 12, 24]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[-0.4, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.06, 12, 24]} />
          <meshStandardMaterial {...dark} />
        </mesh>
      </group>

      {/* decorative marker dots for each part */}
      {robotParts.map((p) => {
        const isActive = activePart === p.id
        const isHovered = hovered === p.id
        return (
          <mesh key={p.id} position={p.markerPosition}>
            <sphereGeometry args={[isActive ? 0.045 : isHovered ? 0.038 : 0.03, 12, 12]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={isActive ? 2 : isHovered ? 1.5 : 1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function pulse(active: boolean, hovered: boolean): { scale?: number } {
  if (active) return { scale: 1.08 }
  if (hovered) return { scale: 1.04 }
  return {}
}
