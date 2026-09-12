import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { heartParts } from '../data/heartParts'
import { currentPhase, heartbeatScale } from '../lib/heartClock'

const muscle = { roughness: 0.32, clearcoat: 0.65, clearcoatRoughness: 0.22, metalness: 0.04 }
const vessel = { roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.3, metalness: 0.05 }

// smooth rotationally-symmetric profile for the left-ventricle mass + apex —
// replaces a sphere-plus-cone hack so there's no seam at the tip
const LV_PROFILE_RAW: [number, number][] = [
  [0.0, -0.62],
  [0.055, -0.5],
  [0.16, -0.32],
  [0.3, -0.1],
  [0.4, 0.12],
  [0.46, 0.32],
  [0.42, 0.48],
  [0.3, 0.58],
]
const LV_PROFILE = LV_PROFILE_RAW.map(([r, y]) => new THREE.Vector2(r, y))
const LV_POSITION = new THREE.Vector3(0.06, -0.18, 0.06)
const LV_SCALE = new THREE.Vector3(0.92, 1, 0.82)

function lvRadiusAt(localY: number): number {
  for (let i = 0; i < LV_PROFILE_RAW.length - 1; i++) {
    const [ra, ya] = LV_PROFILE_RAW[i]
    const [rb, yb] = LV_PROFILE_RAW[i + 1]
    if (localY >= ya && localY <= yb) {
      const t = (localY - ya) / (yb - ya)
      return ra + (rb - ra) * t
    }
  }
  return 0
}

/** A point that hugs the left-ventricle surface, for laying decorative vessels onto it. */
function lvSurfacePoint(localY: number, angleDeg: number, inset = 0.985): THREE.Vector3 {
  const r = lvRadiusAt(localY) * inset
  const rad = (angleDeg * Math.PI) / 180
  return new THREE.Vector3(
    LV_POSITION.x + Math.cos(rad) * r * LV_SCALE.x,
    LV_POSITION.y + localY * LV_SCALE.y,
    LV_POSITION.z + Math.sin(rad) * r * LV_SCALE.z,
  )
}

type Props = {
  activePart: string | null
  onSelect: (id: string) => void
}

export function HeartModel({ activePart, onSelect }: Props) {
  const beatGroup = useRef<THREE.Group>(null)
  const bobGroup = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const lvGeometry = useMemo(() => new THREE.LatheGeometry(LV_PROFILE, 40), [])

  // coronary vessels laid directly onto the left-ventricle surface via
  // lvSurfacePoint, so they hug the mesh instead of floating off it
  const coronaryCurves = useMemo(
    () => [
      new THREE.CatmullRomCurve3([
        lvSurfacePoint(0.45, 72),
        lvSurfacePoint(0.2, 78),
        lvSurfacePoint(-0.05, 70),
        lvSurfacePoint(-0.3, 62),
        lvSurfacePoint(-0.48, 58),
      ]),
      new THREE.CatmullRomCurve3([
        lvSurfacePoint(0.35, 40),
        lvSurfacePoint(0.12, 48),
        lvSurfacePoint(-0.12, 50),
        lvSurfacePoint(-0.32, 45),
      ]),
      new THREE.CatmullRomCurve3([
        lvSurfacePoint(0.3, 105),
        lvSurfacePoint(0.08, 110),
        lvSurfacePoint(-0.15, 100),
      ]),
    ],
    [],
  )

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
      {/* glowing base rings, echoing a medical-HUD display stand */}
      <group position={[0, -0.98, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.006, 8, 64]} />
          <meshBasicMaterial color="#4fd8ff" transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.004, 8, 64]} />
          <meshBasicMaterial color="#4fd8ff" transparent opacity={0.35} />
        </mesh>
      </group>

      <group ref={beatGroup}>
        {/* left ventricle + apex — single smooth lathe surface, no seam at the tip */}
        <mesh
          castShadow
          geometry={lvGeometry}
          position={[0.06, -0.18, 0.06]}
          scale={scaleWith([0.92, 1, 0.82], activePart === 'left-ventricle', hovered === 'left-ventricle')}
          {...hoverHandlers('left-ventricle')}
        >
          <meshPhysicalMaterial {...muscle} color="#b6392c" />
        </mesh>

        {/* right ventricle — tucked deep into the left ventricle's volume so the two read as one fused mass */}
        <mesh
          castShadow
          position={[-0.2, -0.02, 0.2]}
          scale={scaleWith([0.78, 0.9, 0.72], activePart === 'right-ventricle', hovered === 'right-ventricle')}
          {...hoverHandlers('right-ventricle')}
        >
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshPhysicalMaterial {...muscle} color="#9c4a3d" />
        </mesh>

        {/* surface coronary vessels for visual detail */}
        {coronaryCurves.map((curve, i) => (
          <mesh key={i}>
            <tubeGeometry args={[curve, 24, 0.011, 6, false]} />
            <meshPhysicalMaterial color="#5c1712" roughness={0.35} clearcoat={0.5} />
          </mesh>
        ))}

        {/* left atrium */}
        <mesh
          castShadow
          position={[0.14, 0.6, -0.28]}
          scale={scaleWith([0.85, 0.75, 0.85], activePart === 'left-atrium', hovered === 'left-atrium')}
          {...hoverHandlers('left-atrium')}
        >
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshPhysicalMaterial {...muscle} color="#c74a44" />
        </mesh>

        {/* right atrium */}
        <mesh
          castShadow
          position={[-0.34, 0.56, 0.18]}
          scale={scaleWith([0.9, 0.8, 0.9], activePart === 'right-atrium', hovered === 'right-atrium')}
          {...hoverHandlers('right-atrium')}
        >
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshPhysicalMaterial {...muscle} color="#a85847" />
        </mesh>

        {/* aorta — ascending stem + arch */}
        <group scale={highlightScale(activePart === 'aorta', hovered === 'aorta')} {...hoverHandlers('aorta')}>
          <mesh position={[0.12, 0.9, -0.08]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.09, 0.1, 0.35, 20]} />
            <meshPhysicalMaterial {...vessel} color="#e05a4e" />
          </mesh>
          <mesh position={[0.22, 1.07, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.085, 16, 32, Math.PI]} />
            <meshPhysicalMaterial {...vessel} color="#e05a4e" />
          </mesh>
          <mesh position={[0.42, 0.9, -0.05]} rotation={[0.1, 0, 0.05]}>
            <cylinderGeometry args={[0.075, 0.08, 0.35, 16]} />
            <meshPhysicalMaterial {...vessel} color="#e05a4e" />
          </mesh>
        </group>

        {/* pulmonary artery — trunk splitting into two branches */}
        <group
          scale={highlightScale(activePart === 'pulmonary-artery', hovered === 'pulmonary-artery')}
          {...hoverHandlers('pulmonary-artery')}
        >
          <mesh position={[-0.2, 0.82, 0.2]}>
            <cylinderGeometry args={[0.08, 0.09, 0.32, 16]} />
            <meshPhysicalMaterial {...vessel} color="#5c8fc9" />
          </mesh>
          <mesh position={[-0.4, 1.0, 0.16]} rotation={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.06, 0.06, 0.26, 14]} />
            <meshPhysicalMaterial {...vessel} color="#5c8fc9" />
          </mesh>
          <mesh position={[-0.04, 1.02, 0.28]} rotation={[0, 0, -0.55]}>
            <cylinderGeometry args={[0.06, 0.06, 0.26, 14]} />
            <meshPhysicalMaterial {...vessel} color="#5c8fc9" />
          </mesh>
        </group>

        {/* vena cava — superior + inferior */}
        <group
          scale={highlightScale(activePart === 'vena-cava', hovered === 'vena-cava')}
          {...hoverHandlers('vena-cava')}
        >
          <mesh position={[-0.42, 0.97, 0.06]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.065, 0.07, 0.38, 16]} />
            <meshPhysicalMaterial {...vessel} color="#5f76c9" />
          </mesh>
          <mesh position={[-0.4, 0.16, 0.12]} rotation={[0, 0, -0.12]}>
            <cylinderGeometry args={[0.07, 0.075, 0.32, 16]} />
            <meshPhysicalMaterial {...vessel} color="#5f76c9" />
          </mesh>
        </group>

        {/* pulmonary veins — small stubs into the left atrium */}
        <group
          scale={highlightScale(activePart === 'pulmonary-veins', hovered === 'pulmonary-veins')}
          {...hoverHandlers('pulmonary-veins')}
        >
          <mesh position={[0.36, 0.72, -0.38]} rotation={[0.4, 0.3, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.22, 12]} />
            <meshPhysicalMaterial {...vessel} color="#e0708a" />
          </mesh>
          <mesh position={[-0.02, 0.76, -0.46]} rotation={[0.5, -0.2, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.22, 12]} />
            <meshPhysicalMaterial {...vessel} color="#e0708a" />
          </mesh>
        </group>

        {/* mitral valve */}
        <mesh
          position={[0.12, 0.28, -0.03]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={highlightScale(activePart === 'mitral-valve', hovered === 'mitral-valve')}
          {...hoverHandlers('mitral-valve')}
        >
          <torusGeometry args={[0.14, 0.032, 12, 24]} />
          <meshStandardMaterial color="#f0b429" metalness={0.4} roughness={0.35} />
        </mesh>

        {/* tricuspid valve */}
        <mesh
          position={[-0.32, 0.26, 0.2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={highlightScale(activePart === 'tricuspid-valve', hovered === 'tricuspid-valve')}
          {...hoverHandlers('tricuspid-valve')}
        >
          <torusGeometry args={[0.15, 0.032, 12, 24]} />
          <meshStandardMaterial color="#d99a2b" metalness={0.4} roughness={0.35} />
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
