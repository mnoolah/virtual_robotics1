import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { RobotModel } from './components/RobotModel'
import { PartLabel } from './components/PartLabel'
import { AnnotationLines } from './components/AnnotationLines'
import { InfoPanel } from './components/InfoPanel'
import { CameraRig } from './components/CameraRig'
import { robotParts } from './data/robotParts'

function App() {
  const [activePart, setActivePart] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selected = robotParts.find((p) => p.id === activePart) ?? null

  const toggle = (id: string) => setActivePart((cur) => (cur === id ? null : id))

  const pauseAutoRotate = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    setAutoRotate(false)
  }
  const scheduleResume = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setAutoRotate(true), 4000)
  }

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* header */}
      <header className="pointer-events-none absolute top-0 left-0 z-20 w-full px-4 pt-4 md:px-8 md:pt-6">
        <div className="pointer-events-auto inline-flex flex-col rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 shadow-sm backdrop-blur-xl">
          <span className="text-[10px] font-semibold tracking-widest text-[var(--accent)] uppercase">
            INTERACTIVE ROBOTICS
          </span>
          <h1 className="text-lg font-black text-[var(--ink)] md:text-xl">الروبوت</h1>
          <p className="text-xs text-[var(--ink-soft)] md:text-sm">
            نظام التحكم والاستشعار الآلي — اسحب للتدوير، واضغط على أي جزء
          </p>
        </div>
      </header>

      {/* canvas */}
      <Canvas shadows camera={{ position: [2.9, 1.9, 4.3], fov: 38 }} className="!absolute inset-0">
        <color attach="background" args={['#f3e2da']} />
        <fog attach="fog" args={['#f3e2da', 6, 12]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[3, 5, 2]}
          intensity={1.4}
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#8b2f5e" />
        <pointLight position={[0, 1.6, 1.4]} intensity={0.6} color="#3a8fb7" />

        <RobotModel activePart={activePart} onSelect={toggle} />

        <ContactShadows position={[0, -0.82, 0]} opacity={0.35} scale={6} blur={2.4} far={2} />

        <CameraRig activePart={activePart} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          minDistance={1.6}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          onStart={pauseAutoRotate}
          onEnd={scheduleResume}
        />

        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      </Canvas>

      {/* annotation overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <AnnotationLines activePart={activePart} />
        {robotParts.map((p) => (
          <PartLabel key={p.id} part={p} active={activePart === p.id} onClick={() => toggle(p.id)} />
        ))}
      </div>

      {/* control toolbar */}
      <div className="pointer-events-none absolute top-1/2 right-3 z-20 flex -translate-y-1/2 flex-col gap-2 md:right-6">
        <button
          onClick={() => {
            setActivePart(null)
            pauseAutoRotate()
            scheduleResume()
          }}
          title="إعادة الضبط"
          aria-label="إعادة الضبط"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-lg text-[var(--ink)] shadow-sm backdrop-blur-xl transition hover:scale-105 hover:bg-white/90"
        >
          ⟲
        </button>
        <button
          onClick={() => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current)
            setAutoRotate((v) => !v)
          }}
          title={autoRotate ? 'إيقاف التدوير التلقائي' : 'تشغيل التدوير التلقائي'}
          aria-label="تبديل التدوير التلقائي"
          className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border text-lg shadow-sm backdrop-blur-xl transition hover:scale-105 ${
            autoRotate
              ? 'border-transparent bg-[var(--accent)] text-white'
              : 'border-[var(--panel-border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-white/90'
          }`}
        >
          ⟳
        </button>
      </div>

      <InfoPanel part={selected} onClose={() => setActivePart(null)} />
    </div>
  )
}

export default App
