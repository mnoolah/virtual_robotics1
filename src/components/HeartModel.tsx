import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { heartParts } from '../data/heartParts'
import { currentPhase, heartbeatScale } from '../lib/heartClock'

const muscle = { color: '#a8352c', roughness: 0.55, metalness: 0.05 }

type Props = {
  activePart: string | null
  onSelect: (id: string) => void
}

export function HeartModel({ activePart, onSelect }: Props) {
  const beatGroup = useRef<THREE.Group>(null)
  const bobGroup = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useFrame((state) => {
    if (beatGroup.current) {
      const s = heartbeatScale(currentPhase())
      beatGroup.current.scale.setScalar(s)
    }
    if (bobGroup.current) {
      bobGroup.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.03
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
    <group ref={bobGroup} position={[0, -0.15, 0]}>
      <group ref={beatGroup}>
        {/* left ventricle — thick-walled, forms the apex */}
        <mesh
          castShadow
          position={[0.08, -0.15, 0.1]}
          scale={scaleWith([0.85, 1.1, 0.8], activePart === 'left-ventricle', hovered === 'left-ventricle')}
          {...hoverHandlers('left-ventricle')}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial {...muscle} color="#c0392b" />
        </mesh>
        <mesh position={[0.1, -0.7, 0.08]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.2, 0.28, 24]} />
          <meshStandardMaterial {...muscle} color="#c0392b" />
        </mesh>

        {/* right ventricle */}
        <mesh
          castShadow
          position={[-0.32, -0.02, 0.28]}
          scale={scaleWith([0.8, 0.95, 0.75], activePart === 'right-ventricle', hovered === 'right-ventricle')}
          {...hoverHandlers('right-ventricle')}
        >
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial {...muscle} color="#3a5f8b" />
        </mesh>

        {/* left atrium */}
        <mesh
          castShadow
          position={[0.18, 0.66, -0.32]}
          scale={scaleWith([0.9, 0.8, 0.9], activePart === 'left-atrium', hovered === 'left-atrium')}
          {...hoverHandlers('left-atrium')}
        >
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial {...muscle} color="#d1495b" />
        </mesh>

        {/* right atrium */}
        <mesh
          castShadow
          position={[-0.4, 0.6, 0.2]}
          scale={scaleWith([0.95, 0.85, 0.95], activePart === 'right-atrium', hovered === 'right-atrium')}
          {...hoverHandlers('right-atrium')}
        >
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial {...muscle} color="#4a72a8" />
        </mesh>

        {/* aorta — ascending stem + arch */}
        <group scale={highlightScale(activePart === 'aorta', hovered === 'aorta')} {...hoverHandlers('aorta')}>
          <mesh position={[0.12, 0.98, -0.08]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.09, 0.1, 0.35, 20]} />
            <meshStandardMaterial color="#e05a4e" roughness={0.4} />
          </mesh>
          <mesh position={[0.22, 1.15, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.085, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#e05a4e" roughness={0.4} />
          </mesh>
          <mesh position={[0.42, 0.98, -0.05]} rotation={[0.1, 0, 0.05]}>
            <cylinderGeometry args={[0.075, 0.08, 0.35, 16]} />
            <meshStandardMaterial color="#e05a4e" roughness={0.4} />
          </mesh>
        </group>

        {/* pulmonary artery — trunk splitting into two branches */}
        <group
          scale={highlightScale(activePart === 'pulmonary-artery', hovered === 'pulmonary-artery')}
          {...hoverHandlers('pulmonary-artery')}
        >
          <mesh position={[-0.22, 0.9, 0.22]}>
            <cylinderGeometry args={[0.08, 0.09, 0.32, 16]} />
            <meshStandardMaterial color="#5c7fb0" roughness={0.4} />
          </mesh>
          <mesh position={[-0.42, 1.08, 0.18]} rotation={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.06, 0.06, 0.26, 14]} />
            <meshStandardMaterial color="#5c7fb0" roughness={0.4} />
          </mesh>
          <mesh position={[-0.06, 1.1, 0.3]} rotation={[0, 0, -0.55]}>
            <cylinderGeometry args={[0.06, 0.06, 0.26, 14]} />
            <meshStandardMaterial color="#5c7fb0" roughness={0.4} />
          </mesh>
        </group>

        {/* vena cava — superior + inferior */}
        <group
          scale={highlightScale(activePart === 'vena-cava', hovered === 'vena-cava')}
          {...hoverHandlers('vena-cava')}
        >
          <mesh position={[-0.44, 1.05, 0.08]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.065, 0.07, 0.38, 16]} />
            <meshStandardMaterial color="#5c6bb0" roughness={0.4} />
          </mesh>
          <mesh position={[-0.42, 0.18, 0.14]} rotation={[0, 0, -0.12]}>
            <cylinderGeometry args={[0.07, 0.075, 0.32, 16]} />
            <meshStandardMaterial color="#5c6bb0" roughness={0.4} />
          </mesh>
        </group>

        {/* pulmonary veins — small stubs into the left atrium */}
        <group
          scale={highlightScale(activePart === 'pulmonary-veins', hovered === 'pulmonary-veins')}
          {...hoverHandlers('pulmonary-veins')}
        >
          <mesh position={[0.4, 0.78, -0.42]} rotation={[0.4, 0.3, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.22, 12]} />
            <meshStandardMaterial color="#e0708a" roughness={0.4} />
          </mesh>
          <mesh position={[0.02, 0.82, -0.5]} rotation={[0.5, -0.2, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.22, 12]} />
            <meshStandardMaterial color="#e0708a" roughness={0.4} />
          </mesh>
        </group>

        {/* mitral valve */}
        <mesh
          position={[0.15, 0.32, -0.02]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={highlightScale(activePart === 'mitral-valve', hovered === 'mitral-valve')}
          {...hoverHandlers('mitral-valve')}
        >
          <torusGeometry args={[0.14, 0.032, 12, 24]} />
          <meshStandardMaterial color="#c98a2c" metalness={0.4} roughness={0.35} />
        </mesh>

        {/* tricuspid valve */}
        <mesh
          position={[-0.35, 0.3, 0.22]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={highlightScale(activePart === 'tricuspid-valve', hovered === 'tricuspid-valve')}
          {...hoverHandlers('tricuspid-valve')}
        >
          <torusGeometry args={[0.15, 0.032, 12, 24]} />
          <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.35} />
        </mesh>

        {/* decorative marker dots for each part */}
        {heartParts.map((p) => {
          const isActive = activePart === p.id
          const isHovered = hovered === p.id
          return (
            <mesh key={p.id} position={p.markerPosition}>
              <sphereGeometry args={[isActive ? 0.045 : isHovered ? 0.038 : 0.028, 12, 12]} />
              <meshStandardMaterial
                color={p.color}
                emissive={p.color}
                emissiveIntensity={isActive ? 2 : isHovered ? 1.5 : 1}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

function highlightScale(active: boolean, hovered: boolean): number {
  if (active) return 1.08
  if (hovered) return 1.04
  return 1
}

function scaleWith(
  base: [number, number, number],
  active: boolean,
  hovered: boolean,
): [number, number, number] {
  const h = highlightScale(active, hovered)
  return [base[0] * h, base[1] * h, base[2] * h]
}
