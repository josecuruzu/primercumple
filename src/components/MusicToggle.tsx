'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '@/lib/audio'

export default function MusicToggle() {
  const { playing, toggle } = useAudio()

  return (
    <motion.button
      onClick={toggle}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260 }}
      whileTap={{ scale: 0.88 }}
      className="fixed z-40 flex items-center justify-center rounded-full"
      style={{
        top: '16px',
        right: '16px',
        width: '44px',
        height: '44px',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255,255,255,0.9)',
        boxShadow: '0 4px 16px rgba(58,154,181,0.25)',
      }}
      aria-label={playing ? 'Pausar música' : 'Reproducir música'}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.span
            key="playing"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: '20px', lineHeight: 1 }}
          >
            🎵
          </motion.span>
        ) : (
          <motion.span
            key="paused"
            initial={{ scale: 0, rotate: 30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -30 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: '20px', lineHeight: 1, filter: 'grayscale(1)', opacity: 0.5 }}
          >
            🎵
          </motion.span>
        )}
      </AnimatePresence>

      {/* Animated sound waves when playing */}
      {playing && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(110,198,216,0.5)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  )
}
