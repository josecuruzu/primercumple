'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Whale, Seahorse, Turtle, Crab, Starfish, Jellyfish, Octopus,
  FishNemo, FishColor, FishBlue,
  Seaweed, Coral, Bubbles, GaelTitle
} from '@/components/OceanElements'
import PhotoGallery from '@/components/PhotoGallery'
import MessageForm from '@/components/MessageForm'
import MessagesDisplay from '@/components/MessagesDisplay'
import MusicToggle from '@/components/MusicToggle'
import { sfx } from '@/lib/audio'

type Tab = 'gallery' | 'messages'

function Plant({ src, alt, width, height, className = '', style }: {
  src: string; alt: string; width: number; height: number;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <Image src={src} alt={alt} width={width} height={height} className={className}
      style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))', ...style }}
    />
  )
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('gallery')
  const [refreshMessages, setRefreshMessages] = useState(0)

  const handleOpenForm = () => {
    sfx.chime()
    setShowForm(true)
  }

  const handleSwitchTab = (tab: Tab) => {
    sfx.pop()
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #d8f2f8 0%, #b8e8f0 40%, #a0dce8 100%)' }}>

      <Bubbles />

      {/* Music toggle button */}
      <MusicToggle />

      {/* ── OCEAN FLOOR ── */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-10">

        {/* Back layer: SVG seaweed */}
        <div className="absolute bottom-0 left-0 flex items-end gap-1" style={{ width: '90px' }}>
          <Seaweed variant={3} className="w-8 seaweed-sway"       style={{ height: '80px', opacity: 0.7 }}/>
          <Seaweed variant={1} className="w-7 seaweed-sway-delay" style={{ height: '62px', opacity: 0.7 }}/>
        </div>
        <div className="absolute bottom-0 right-0 flex items-end gap-1 flex-row-reverse" style={{ width: '90px' }}>
          <Seaweed variant={2} className="w-8 seaweed-sway-delay" style={{ height: '78px', opacity: 0.7 }}/>
          <Seaweed variant={3} className="w-7 seaweed-sway"       style={{ height: '60px', opacity: 0.7 }}/>
        </div>

        {/* Mid layer: alga_teal */}
        <div className="absolute bottom-0" style={{ left: '4px' }}>
          <Plant src="/plants/alga_teal.png" alt="alga teal" width={70} height={67}
            className="alga-wave" style={{ width: '70px' }}/>
        </div>
        <div className="absolute bottom-0" style={{ right: '4px' }}>
          <Plant src="/plants/alga_teal.png" alt="alga teal" width={70} height={67}
            className="alga-wave-r" style={{ width: '70px' }}/>
        </div>

        {/* Mid layer: alga_verde */}
        <div className="absolute bottom-0" style={{ left: '18%' }}>
          <Plant src="/plants/alga_verde.png" alt="alga verde" width={78} height={86}
            className="alga-wave-delay" style={{ width: '78px' }}/>
        </div>
        <div className="absolute bottom-0" style={{ right: '18%' }}>
          <Plant src="/plants/alga_verde.png" alt="alga verde" width={78} height={86}
            className="alga-wave-r" style={{ width: '78px', animationDelay: '1s' }}/>
        </div>

        {/* Front layer: coral clusters */}
        <div className="absolute bottom-0" style={{ left: '8%' }}>
          <Plant src="/plants/coral_pink.png" alt="coral rosa" width={90} height={84}
            className="coral-bob" style={{ width: '90px' }}/>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <Plant src="/plants/coral_teal.png" alt="coral teal" width={100} height={95}
            className="coral-bob-delay" style={{ width: '100px' }}/>
        </div>
        <div className="absolute bottom-0" style={{ right: '8%' }}>
          <Plant src="/plants/coral_purple.png" alt="coral violeta" width={88} height={78}
            className="coral-bob-r" style={{ width: '88px' }}/>
        </div>

        {/* SVG Coral accent */}
        <div className="absolute bottom-0 left-1/2" style={{ marginLeft: '60px' }}>
          <Coral className="w-10" style={{ height: '55px', opacity: 0.6 }}/>
        </div>

        {/* Wave overlay */}
        <svg viewBox="0 0 414 28" xmlns="http://www.w3.org/2000/svg"
          className="w-full relative z-10" style={{ marginBottom: '-1px' }}>
          <path d="M 0 18 Q 52 4 103 18 Q 155 32 207 18 Q 259 4 311 18 Q 362 32 414 18 L 414 28 L 0 28 Z"
            fill="rgba(90,171,122,0.28)"/>
        </svg>
      </div>

      {/* ── SWIMMING ANIMALS ── */}
      <div className="fixed pointer-events-none z-0" style={{ top: '30%', animation: 'swim 22s linear 2s infinite' }}>
        <FishNemo style={{ width: '60px', opacity: 0.25 }}/>
      </div>
      <div className="fixed pointer-events-none z-0" style={{ top: '62%', animation: 'swim2 30s linear 9s infinite' }}>
        <Jellyfish style={{ width: '44px', opacity: 0.2 }}/>
      </div>
      <div className="fixed pointer-events-none z-0" style={{ top: '48%', animation: 'swim 38s linear 18s infinite' }}>
        <FishBlue style={{ width: '50px', opacity: 0.18 }}/>
      </div>

      {/* ── HEADER ── */}
      <header className="relative pt-12 pb-6 px-4 text-center z-20">
        <div className="absolute top-6 left-2 animate-float" style={{ animationDelay: '0s' }}>
          <Whale style={{ width: '90px', filter: 'drop-shadow(0 4px 8px rgba(58,154,181,0.3))' }}/>
        </div>
        <div className="absolute top-4 right-3 animate-float-slow" style={{ animationDelay: '1s' }}>
          <Seahorse style={{ width: '50px', filter: 'drop-shadow(0 3px 6px rgba(200,130,50,0.25))' }}/>
        </div>

        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }} className="mt-4">
          <GaelTitle />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }} className="mt-1">
          <p className="font-bubble font-bold text-3xl" style={{
            color: '#3a9ab5',
            textShadow: '0 2px 0 rgba(255,255,255,0.8), 0 3px 8px rgba(58,154,181,0.3)',
          }}>
            Mi primer añito
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          <Starfish style={{ width: '34px' }} className="animate-float"/>
          <span style={{ opacity: 0.45, fontSize: '13px' }}>🫧🫧</span>
          <Turtle   style={{ width: '52px' }} className="animate-float-slow"/>
          <span style={{ opacity: 0.45, fontSize: '13px' }}>🫧🫧</span>
          <Crab     style={{ width: '42px' }} className="animate-float"/>
          <span style={{ opacity: 0.45, fontSize: '13px' }}>🫧🫧</span>
          <Octopus  style={{ width: '38px' }} className="animate-float-slow"/>
        </motion.div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-20 px-4 pb-44 max-w-lg mx-auto">

        {/* Tabs */}
        <div className="flex rounded-2xl p-1 mb-6" style={{
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.8)',
        }}>
          {(['gallery', 'messages'] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => handleSwitchTab(tab)}
              className="flex-1 py-3 rounded-xl font-bubble font-bold text-base transition-all duration-300"
              style={{
                color: activeTab === tab ? 'white' : '#3a9ab5',
                background: activeTab === tab ? 'linear-gradient(135deg, #6ec6d8, #3a9ab5)' : 'transparent',
                boxShadow: activeTab === tab ? '0 4px 12px rgba(58,154,181,0.3)' : 'none',
              }}>
              {tab === 'gallery' ? '📸 Fotos' : '💌 Mensajes'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'gallery' ? (
            <motion.div key="gallery"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <PhotoGallery />
            </motion.div>
          ) : (
            <motion.div key="messages"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <MessagesDisplay refresh={refreshMessages} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── FAB ── */}
      <AnimatePresence>
  {activeTab === 'messages' && (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 flex justify-center z-30 px-4"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 24px)' }}
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.button 
        whileTap={{ scale: 0.96 }} 
        onClick={handleOpenForm}
        className="w-full max-w-sm py-4 rounded-2xl font-bubble font-extrabold text-xl text-white flex items-center justify-center gap-3"
        style={{
          background: 'linear-gradient(135deg, #f06b8a 0%, #e04868 100%)',
          boxShadow: '0 8px 32px rgba(240,107,138,0.5)',
        }}
      >
        <motion.span animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
          💌
        </motion.span>
        Dejar mi mensaje
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <FishColor style={{ width: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}/>
        </motion.div>
      </motion.button>
    </motion.div>
  )}
</AnimatePresence>

      {showForm && (
        <MessageForm
          onClose={() => { setShowForm(false) }}
          onSuccess={() => { setRefreshMessages(r => r + 1); setActiveTab('messages') }}
        />
      )}
    </div>
  )
}
