import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { RobotModel } from './components/RobotModel'
import { PartLabel } from './components/PartLabel'
import { AnnotationLines } from './components/AnnotationLines'
import { InfoPanel } from './components/InfoPanel'
import { robotParts } from './data/robotParts'

function App() {
  const [activePart, setActivePart] = useState<string | null>(null)
  const selected = robotParts.find((p) => p.id === activePart) ?? null

  const toggle = (id: string) => setActivePart((cur) => (cur === id ? null : id))

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
            نظام التحكم والاستشعار الآلي
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

        <OrbitControls
          target={[0, 0.85, 0]}
          enablePan={false}
          minDistance={2.8}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate
          autoRotateSpeed={0.6}
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

      {/* footer nav pills */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 gap-2 md:flex">
        <button
          onClick={() => setActivePart(null)}
          className="pointer-events-auto rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--ink)] shadow-sm backdrop-blur-xl transition hover:bg-white/90"
        >
          إعادة الضبط
        </button>
      </div>

      <InfoPanel part={selected} onClose={() => setActivePart(null)} />
    </div>
  )
}

export default App
