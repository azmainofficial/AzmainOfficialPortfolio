// nextjs-3d-portfolio.jsx
// Single-file Next.js page component demo (can be used as pages/index.js or app/page.js)
// Requires: Next.js 13+, TailwindCSS, framer-motion, @react-three/fiber, @react-three/drei, lucide-react
'use client';

import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Html, useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Mesh } from 'three';
import { Sun, Moon, Mail } from 'lucide-react'

// --- 3D Scene Component ---
function AnimatedTorus({ hovered }: { hovered: boolean }) {
  const ref = useRef<Mesh>(null!);
  useFrame((st, dt) => {
    ref.current.rotation.x += dt * 0.2
    ref.current.rotation.y += dt * 0.5
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={ref} castShadow>
        <torusKnotGeometry args={[0.9, 0.35, 256, 32]} />
        <meshStandardMaterial metalness={0.8} roughness={0.15} envMapIntensity={1} color={hovered ? '#ff6b6b' : '#7c3aed'} />
      </mesh>
    </Float>
  )
}

function GroundGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#0f172a" metalness={0} roughness={1} />
    </mesh>
  )
}
interface SceneProps {
  setHovered: (hovered: boolean) => void;
}

function Scene({ setHovered }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight castShadow position={[5, 8, 5]} intensity={1.0} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      <Suspense fallback={null}>
        <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <AnimatedTorus hovered={false} /> {/* pass hovered as needed */}
        </group>
      </Suspense>

      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      <GroundGrid />
    </>
  );
}

// --- UI Component ---
export default function PortfolioPage() {
  const [dark, setDark] = useState(true)
  const [hovered, setHovered] = useState(false)

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'} transition-colors duration-500`}>
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">AS</div>
          <div>
            <div className="text-lg font-semibold">Azmain Sheikh</div>
            <div className="text-xs opacity-60">ML Engineer · Software Developer</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm opacity-90">
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="toggle theme"
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg hover:bg-slate-700/20 transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#contact" className="hidden sm:inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-white text-sm">Hire me</a>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <section className="pt-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight"
          >
            I build intelligent systems and sleek interfaces —
            <span className="text-violet-400"> thoughtfully, fast.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-slate-300"
          >
            I'm Azmain — a pragmatic maker mixing machine learning, automation, and web craft. I ship production-ready models and clean, fast front-ends. If you're building something that matters, let's make it reliable and beautiful.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex gap-4">
            <a href="#projects" className="px-5 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg text-white font-medium">See projects</a>
            <a href="#contact" className="px-5 py-3 border rounded-lg">Get in touch</a>
          </motion.div>

          <motion.div className="mt-8 flex flex-wrap gap-3 text-xs opacity-80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <span className="px-3 py-2 bg-slate-800 rounded">React</span>
            <span className="px-3 py-2 bg-slate-800 rounded">Next.js</span>
            <span className="px-3 py-2 bg-slate-800 rounded">TensorFlow / PyTorch</span>
            <span className="px-3 py-2 bg-slate-800 rounded">Three.js</span>
            <span className="px-3 py-2 bg-slate-800 rounded">Docker</span>
          </motion.div>

          <div className="mt-8">
            <motion.a whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 text-sm opacity-90" href="/resume.pdf">
              <Mail size={16} />
              <span>Download resume</span>
            </motion.a>
          </div>
        </section>

        {/* 3D Canvas */}
        <section className="h-96 md:h-[480px] rounded-2xl overflow-hidden relative shadow-2xl">
          <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
            <Scene setHovered={setHovered} />
          </Canvas>

          {/* Overlay info box */}
          <div className="absolute left-4 bottom-4 bg-black/40 backdrop-blur rounded-lg px-4 py-2 text-sm text-white">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${hovered ? 'bg-rose-400' : 'bg-violet-400'}`} />
              <div>{hovered ? 'Interactive — touch to transform' : '3D live preview'}</div>
            </div>
          </div>
        </section>
      </main>

      {/* Projects */}
      <section id="projects" className="max-w-6xl mx-auto px-6 mt-20">
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold">Selected Projects</motion.h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Plant disease classifier', desc: '38 classes, MobileNet+VGG ensemble, 92% accuracy', tag: 'ML' },
            { title: 'Wearable health IoT dashboard', desc: 'Realtime charts, alerts, mobile-friendly', tag: 'IoT' },
            { title: 'Asteroids 2D game', desc: 'GLUT C++ with asteroid splitting and effects', tag: 'Game' },
          ].map((p) => (
            <motion.article key={p.title} whileHover={{ y: -6 }} className="p-4 bg-slate-800 rounded-lg">
              <div className="text-sm opacity-70">{p.tag}</div>
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm opacity-80">{p.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                <a className="text-sm underline" href="#">Case study</a>
                <a className="text-sm underline" href="#">Code</a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-6xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold">About me</h3>
            <p className="mt-4 text-slate-300">I pair principled machine learning with practical engineering. My focus is on deployment — reproducible pipelines, efficient inference, and clean UI that surfaces insights. I prefer small, fast models that do real work.</p>
            <ul className="mt-4 space-y-2 text-sm opacity-85">
              <li>• Production ML: model design, pruning, quantization, CI/CD</li>
              <li>• Web: Next.js, React, Three.js for delightful UI</li>
              <li>• Embedded & IoT: ESP8266/NodeMCU integrations</li>
            </ul>
          </div>

          <aside className="p-4 rounded-lg bg-slate-800">
            <div className="text-sm opacity-70">Contact</div>
            <div className="mt-2">Uttara, Dhaka</div>
            <div className="mt-2">azmain@example.com</div>
            <div className="mt-4 flex gap-2">
              <a className="px-3 py-2 rounded bg-slate-700 text-sm">LinkedIn</a>
              <a className="px-3 py-2 rounded bg-slate-700 text-sm">GitHub</a>
            </div>
          </aside>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="max-w-4xl mx-auto px-6 mt-16 mb-32">
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold">Let's build something</motion.h2>

        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-3 rounded bg-slate-800" placeholder="Your name" />
          <input className="p-3 rounded bg-slate-800" placeholder="Email" />
          <textarea className="md:col-span-2 p-3 rounded bg-slate-800" placeholder="Tell me about your project" rows={6} />
          <div className="md:col-span-2 flex justify-end">
            <button type="button" className="px-5 py-3 bg-violet-600 rounded">Send message</button>
          </div>
        </motion.form>
      </section>

      <footer className="py-8 text-center opacity-70">© {new Date().getFullYear()} Azmain Sheikh — Built with care.</footer>
    </div>
  )
}
