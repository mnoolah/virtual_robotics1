import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { heartParts } from '../data/heartParts'

const DEFAULT_TARGET = new THREE.Vector3(0, 0.15, 0)
const DEFAULT_CAMERA_POS = new THREE.Vector3(2.5, 1.7, 3.7)
const FOCUS_DISTANCE = 1.6
const GROUP_Y_OFFSET = -0.15

const worldPositions = new Map(
  heartParts.map((p) => [
    p.id,
    new THREE.Vector3(p.markerPosition[0], p.markerPosition[1] + GROUP_Y_OFFSET, p.markerPosition[2]),
  ]),
)

type Props = {
  activePart: string | null
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}

export function CameraRig({ activePart, controlsRef }: Props) {
  const { camera } = useThree()
  const desiredPos = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const lerpFactor = 1 - Math.pow(0.001, delta)
    const focusPoint = activePart ? worldPositions.get(activePart) : undefined
    const target = focusPoint ?? DEFAULT_TARGET

    controls.target.lerp(target, lerpFactor)

    if (focusPoint) {
      const dir = camera.position.clone().sub(controls.target).normalize()
      if (dir.lengthSq() < 0.0001) dir.set(0, 0.15, 1).normalize()
      desiredPos.current.copy(focusPoint).add(dir.multiplyScalar(FOCUS_DISTANCE))
      camera.position.lerp(desiredPos.current, lerpFactor)
    } else {
      camera.position.lerp(DEFAULT_CAMERA_POS, lerpFactor * 0.6)
    }

    controls.update()
  })

  return null
}
