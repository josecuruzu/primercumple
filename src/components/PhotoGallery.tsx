'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { sfx } from '@/lib/audio'

// portrait: true  → 1064×1600 (tall) — container fills sides with animals
// portrait: false → 1600×1064 (wide) — fills the frame exactly
const GALLERY_PHOTOS = [
  { src: '/photos/photo1.jpg', caption: '¡Hola mundo! 🌊',       placeholderAnimal: '/animals/ballena.png',   bg: 'linear-gradient(135deg,#6ec6d8,#3a9ab5)', portrait: false },
  { src: '/photos/photo2.jpg', caption: 'Mi primer baño 🛁',      placeholderAnimal: '/animals/tortuga.png',   bg: 'linear-gradient(135deg,#5aab7a,#3a9ab5)', portrait: true  },
  { src: '/photos/photo3.jpg', caption: 'Primera sonrisita 😊',   placeholderAnimal: '/animals/pez_nemo.png',  bg: 'linear-gradient(135deg,#e8805a,#c85040)', portrait: false },
  { src: '/photos/photo4.jpg', caption: '¡Ya casi camino! 👟',    placeholderAnimal: '/animals/pez_pecas.png', bg: 'linear-gradient(135deg,#a8ddd6,#6ec6d8)', portrait: true  },
  { src: '/photos/photo5.jpg', caption: 'Mis juguetes 🦀',        placeholderAnimal: '/animals/pulpo.png',     bg: 'linear-gradient(135deg,#b8e8f0,#5aab7a)', portrait: false },
]

// Animals placed as side decoration for portrait photos
// Each side gets a stack of floaty animals
const LEFT_ANIMALS  = ['/animals/estrella_De_mar.png', '/animals/medusa.png',  '/animals/erizo_de_mar.png']
const RIGHT_ANIMALS = ['/animals/cangrejo.png',        '/animals/pez_color.png', '/animals/seahorse.png']

// Floating animation delays
const FLOAT_DELAYS = [0, 1.2, 2.4]

function SideAnimals({ side }: { side: 'left' | 'right' }) {
  const animals = side === 'left' ? LEFT_ANIMALS : RIGHT_ANIMALS
  return (
    <div
      className="absolute top-0 bottom-0 flex flex-col items-center justify-around py-4 z-10"
      style={{
        [side]: 0,
        width: '22%',
        background: side === 'left'
          ? 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 100%)'
          : 'linear-gradient(to left,  rgba(0,0,0,0.18) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}
    >
      {animals.map((src, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, delay: FLOAT_DELAYS[i], ease: 'easeInOut' }}
        >
          <Image
            src={src}
            alt="animal marino"
            width={52}
            height={52}
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
              transform: side === 'right' ? 'scaleX(-1)' : 'none',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

function PhotoSlide({ photo, isActive, index }: {
  photo: typeof GALLERY_PHOTOS[0]
  isActive: boolean
  index: number
}) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)

  return (
    // Frame fills 100% of the fixed-height container
    <div className="relative w-full h-full" style={{ background: photo.bg }}>

      {/* ── Side animals only for portrait shots ── */}
      {photo.portrait && loaded && !error && (
        <>
          <SideAnimals side="left" />
          <SideAnimals side="right" />
        </>
      )}

      {/* ── Real photo ── */}
      {!error && (
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          style={{
            // portrait: contain so nothing clips, landscape: cover to fill
            objectFit: photo.portrait ? 'contain' : 'cover',
            objectPosition: 'center center',
            // portrait photo sits in center; side animals fill the gaps
          }}
          priority={index === 0}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {/* ── Placeholder while loading / error ── */}
      {(!loaded || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
          <motion.div
            animate={{ y: isActive ? [0, -12, 0] : 0 }}
            transition={{ duration: 3, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
          >
            <Image
              src={photo.placeholderAnimal}
              alt={photo.caption}
              width={150}
              height={130}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.22))' }}
            />
          </motion.div>
          <p className="font-bubble font-bold text-xl text-white text-center px-8"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {photo.caption}
          </p>
          <p className="text-white/60 text-sm">Foto #{index + 1}</p>
        </div>
      )}

      {/* ── Caption gradient at bottom ── */}
      {loaded && !error && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20"
          style={{
            background: 'linear-gradient(to top, rgba(13,74,98,0.7) 0%, transparent 100%)',
          }}
        >
          <p className="font-bubble font-bold text-base text-white text-center"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            {photo.caption}
          </p>
        </div>
      )}

      {/* ── Active shimmer ── */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: 'linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.07) 50%,transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s infinite',
        }}/>
      )}
    </div>
  )
}

export default function PhotoGallery({ onNav }: { onNav?: () => void }) {
  // Fixed height = landscape ratio of 1600×1064 relative to device width
  // We compute this as a CSS value: (1064/1600)*100vw capped at a max
  // Implemented via padding-top trick so it's truly responsive
  const ASPECT = 1064 / 1600   // ≈ 0.665 → height is 66.5% of width

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      emblaApi?.canScrollNext() ? emblaApi.scrollNext() : emblaApi?.scrollTo(0)
    }, 4500)
  }, [emblaApi])

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    if (autoplay) startTimer()
    return () => {
      stopTimer()
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect, autoplay, startTimer, stopTimer])

  const toggleAutoplay = () => {
    sfx.pop()
    if (autoplay) { stopTimer(); setAutoplay(false) }
    else          { setAutoplay(true); startTimer() }
  }

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="text-center mb-3">
        <h2 className="font-bubble font-bold text-2xl" style={{ color: '#1d6d87' }}>
          📸 Nuestro álbum del mar
        </h2>
        <p className="text-sm font-body" style={{ color: '#3a9ab5' }}>
          Un año de aventuras oceánicas 🌊
        </p>
      </div>

      {/* ── Carousel — height derived from landscape aspect ratio ── */}
      {/* padding-top trick: height = width × (1064/1600) */}
      <div style={{ position: 'relative', width: '100%', paddingTop: `${ASPECT * 100}%` }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div
            className="embla h-full"
            ref={emblaRef}
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(13,74,98,0.25)',
              border: '3px solid rgba(255,255,255,0.85)',
              height: '100%',
            }}
          >
            <div className="embla__container h-full">
              {GALLERY_PHOTOS.map((photo, index) => (
                <div key={index} className="embla__slide h-full">
                  <motion.div
                    className="h-full"
                    animate={{
                      scale:   index === selectedIndex ? 1    : 0.96,
                      opacity: index === selectedIndex ? 1    : 0.6,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <PhotoSlide
                      photo={photo}
                      isActive={index === selectedIndex}
                      index={index}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls: dots + play/stop only ── */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Dot indicators */}
        <div className="flex gap-2 items-center">
          {GALLERY_PHOTOS.map((_, index) => (
            <button
              key={index}
              onClick={() => { sfx.slide(); emblaApi?.scrollTo(index); onNav?.() }}
              className="rounded-full transition-all duration-300"
              style={{
                width:      index === selectedIndex ? '20px' : '8px',
                height:     '8px',
                background: index === selectedIndex ? '#3a9ab5' : 'rgba(110,198,216,0.4)',
              }}
            />
          ))}
        </div>

        {/* Play / Stop button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleAutoplay}
          className="flex items-center justify-center rounded-full ml-2"
          style={{
            width: '44px',
            height: '44px',
            background: autoplay
              ? 'linear-gradient(135deg,#6ec6d8,#3a9ab5)'
              : 'rgba(255,255,255,0.8)',
            border: autoplay
              ? '2px solid rgba(255,255,255,0.5)'
              : '2px solid rgba(110,198,216,0.5)',
            boxShadow: autoplay
              ? '0 4px 14px rgba(58,154,181,0.4)'
              : '0 4px 12px rgba(58,154,181,0.15)',
          }}
          aria-label={autoplay ? 'Pausar presentación' : 'Reproducir presentación'}
        >
          <AnimatePresence mode="wait">
            {autoplay ? (
              <motion.svg
                key="stop"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                width="16" height="16" viewBox="0 0 16 16" fill="none"
              >
                {/* Pause icon */}
                <rect x="3" y="2" width="4" height="12" rx="1.5" fill="white"/>
                <rect x="9" y="2" width="4" height="12" rx="1.5" fill="white"/>
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                width="16" height="16" viewBox="0 0 16 16" fill="none"
              >
                {/* Play icon */}
                <path d="M4 2.5 L13 8 L4 13.5 Z" fill="#3a9ab5"/>
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Pulse ring when playing */}
          {autoplay && (
            <motion.div
              className="absolute rounded-full"
              style={{ width: '44px', height: '44px', border: '2px solid rgba(110,198,216,0.5)' }}
              animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.button>
      </div>

      {/* Swipe hint — shown only once */}
      <p className="text-center text-xs mt-2 font-body" style={{ color: 'rgba(58,154,181,0.6)' }}>
        desliza para ver más fotos 👆
      </p>
    </div>
  )
}
