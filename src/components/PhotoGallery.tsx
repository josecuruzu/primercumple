'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { sfx } from '@/lib/audio'

const GALLERY_PHOTOS = [
  { src: '/photos/photo1.jpg', caption: '¡Hola mundo! 🌊',      placeholderAnimal: '/animals/ballena.png',   bg: '#3a9ab5', portrait: false },
  { src: '/photos/photo2.jpg', caption: 'Mi primer baño 🛁',     placeholderAnimal: '/animals/tortuga.png',   bg: '#5aab7a', portrait: true  },
  { src: '/photos/photo3.jpg', caption: 'Primera sonrisita 😊',  placeholderAnimal: '/animals/pez_nemo.png',  bg: '#c85040', portrait: false },
  { src: '/photos/photo4.jpg', caption: '¡Ya casi camino! 👟',   placeholderAnimal: '/animals/pez_pecas.png', bg: '#6ec6d8', portrait: true  },
  { src: '/photos/photo5.jpg', caption: 'Mis juguetes 🦀',       placeholderAnimal: '/animals/pulpo.png',     bg: '#5aab7a', portrait: false },
]

// Animals shown TOP and BOTTOM for landscape photos (2048×1363)
// because landscape fits within portrait container with bands above and below
const TOP_ANIMALS    = ['/animals/estrella_De_mar.png', '/animals/medusa.png',   '/animals/pez_color.png']
const BOTTOM_ANIMALS = ['/animals/cangrejo.png',        '/animals/seahorse.png', '/animals/erizo_de_mar.png']

function TopBottomAnimals({ photoIndex }: { photoIndex: number }) {
  const topAnimal    = TOP_ANIMALS[photoIndex % TOP_ANIMALS.length]
  const bottomAnimal = BOTTOM_ANIMALS[photoIndex % BOTTOM_ANIMALS.length]
  return (
    <>
      {/* Top band */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none flex items-center justify-around px-6"
        style={{
          top: 0,
          // band height = half the letterbox gap
          // container is 1363/2048 tall, photo is 2048/1363 wide
          // gap each side = (1 - (1363/2048)/(2048/1363)) / 2 × 100%
          // = (1 - (1363²/2048²)) / 2 = (1 - 0.443) / 2 ≈ 27.9% each
          height: '27%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div key={i}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
          >
            <Image src={topAnimal} alt="" width={56} height={56}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.3))' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom band */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none flex items-center justify-around px-6"
        style={{
          bottom: 0,
          height: '27%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div key={i}
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, delay: i * 1.1, ease: 'easeInOut' }}
          >
            <Image src={bottomAnimal} alt="" width={56} height={56}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.3))' }}
            />
          </motion.div>
        ))}
      </div>
    </>
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
    <div className="relative w-full h-full" style={{ background: photo.bg }}>

      {/* Top/bottom animals only for LANDSCAPE photos (2048×1363) */}
      {!photo.portrait && loaded && !error && (
        <TopBottomAnimals photoIndex={index} />
      )}

      {/* Real photo */}
      {!error && (
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          priority={index === 0}
          style={{
            objectFit: 'contain',       // always show full photo, no cropping
            objectPosition: 'center',
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {/* Placeholder while loading */}
      {(!loaded || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
          <motion.div
            animate={{ y: isActive ? [0, -12, 0] : 0 }}
            transition={{ duration: 3, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
          >
            <Image src={photo.placeholderAnimal} alt={photo.caption}
              width={160} height={140}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.25))' }}
            />
          </motion.div>
          <p className="font-bubble font-bold text-xl text-white text-center px-8"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
            {photo.caption}
          </p>
        </div>
      )}

      {/* Caption bar at bottom */}
      {loaded && !error && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20"
          style={{ background: 'linear-gradient(to top, rgba(13,74,98,0.72) 0%, transparent 100%)' }}>
          <p className="font-bubble font-bold text-base text-white text-center"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            {photo.caption}
          </p>
        </div>
      )}

      {/* Shimmer on active */}
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
  // Container uses portrait aspect ratio 1363:2048
  // → height = width × (2048/1363) ≈ 1.503
  // Portrait photos (1363×2048) fill it exactly.
  // Landscape photos (2048×1363) are contained with side animals filling the bands.
  const PORTRAIT_RATIO = 2048 / 1363   // kept for reference, not used in JSX directly

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    dragFree: false,
    // DO NOT pass watchDrag:false — must stay true (default) for swipe to work
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoplay, setAutoplay]           = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (emblaApi) {
        emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0)
      }
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
    else          { setAutoplay(true) }   // startTimer triggers via effect
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

      {/*
        CAROUSEL WRAPPER
        ─────────────────
        aspect-ratio: 1363 / 2048  → portrait shape (1363×2048 photos)
        max-height: 72dvh           → never taller than 72% of viewport on any iPhone
        The Embla root fills this box 100%.
        Slides also fill 100% height.
        Photos use object-fit:contain so nothing ever clips.
      */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1363 / 2048',
          maxHeight: '72dvh',
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(13,74,98,0.28)',
          border: '3px solid rgba(255,255,255,0.88)',
        }}
      >
        {/* Embla root — fills the wrapper box */}
        <div
          ref={emblaRef}
          style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        >
          {/* Track */}
          <div
            style={{
              display: 'flex',
              height: '100%',
              // IMPORTANT: touch-action must allow horizontal pan for swipe
              touchAction: 'pan-y',
            }}
          >
            {GALLERY_PHOTOS.map((photo, index) => (
              <div
                key={index}
                style={{
                  flex: '0 0 100%',
                  minWidth: 0,
                  height: '100%',
                  position: 'relative',
                }}
              >
                <motion.div
                  style={{ width: '100%', height: '100%' }}
                  animate={{
                    scale:   index === selectedIndex ? 1    : 0.97,
                    opacity: index === selectedIndex ? 1    : 0.55,
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

      {/* Controls: dots + play/stop */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Dots */}
        <div className="flex gap-2 items-center">
          {GALLERY_PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => { sfx.slide(); emblaApi?.scrollTo(i); onNav?.() }}
              style={{
                width:      i === selectedIndex ? '20px' : '8px',
                height:     '8px',
                borderRadius: '4px',
                background: i === selectedIndex ? '#3a9ab5' : 'rgba(110,198,216,0.4)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Play / Pause button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleAutoplay}
          aria-label={autoplay ? 'Pausar' : 'Reproducir'}
          style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: autoplay
              ? 'linear-gradient(135deg,#6ec6d8,#3a9ab5)'
              : 'rgba(255,255,255,0.82)',
            border: autoplay
              ? '2px solid rgba(255,255,255,0.5)'
              : '2px solid rgba(110,198,216,0.5)',
            boxShadow: autoplay
              ? '0 4px 14px rgba(58,154,181,0.4)'
              : '0 4px 12px rgba(58,154,181,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <AnimatePresence mode="wait">
            {autoplay ? (
              <motion.svg key="pause"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
                width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3"  y="2" width="4" height="12" rx="1.5" fill="white"/>
                <rect x="9" y="2" width="4" height="12" rx="1.5" fill="white"/>
              </motion.svg>
            ) : (
              <motion.svg key="play"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
                width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5 L13 8 L4 13.5 Z" fill="#3a9ab5"/>
              </motion.svg>
            )}
          </AnimatePresence>

          {autoplay && (
            <motion.div
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2px solid rgba(110,198,216,0.6)',
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.button>
      </div>

      {/* Swipe hint */}
      <p className="text-center text-xs mt-2 font-body"
        style={{ color: 'rgba(58,154,181,0.55)' }}>
        desliza para ver más fotos 👆
      </p>
    </div>
  )
}
