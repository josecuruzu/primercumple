'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { sfx } from '@/lib/audio'

// Photo metadata — set `portrait: true` for 1064×1600, leave false for 1600×1064
// The slide container adapts its aspect-ratio automatically per photo.
const GALLERY_PHOTOS = [
  { src: '/photos/photo1.jpg', caption: '¡Hola mundo! 🌊', placeholderAnimal: '/animals/ballena.png', bg: 'linear-gradient(135deg,#6ec6d8,#3a9ab5)', portrait: false },
  { src: '/photos/photo2.jpg', caption: 'Mi primer baño 🛁', placeholderAnimal: '/animals/tortuga.png', bg: 'linear-gradient(135deg,#5aab7a,#3a9ab5)', portrait: true },
  { src: '/photos/photo3.jpg', caption: 'Primera sonrisita 😊', placeholderAnimal: '/animals/pez_nemo.png', bg: 'linear-gradient(135deg,#e8805a,#c85040)', portrait: false },
  { src: '/photos/photo4.jpg', caption: '¡Ya casi camino! 👟', placeholderAnimal: '/animals/pez_pecas.png', bg: 'linear-gradient(135deg,#a8ddd6,#6ec6d8)', portrait: true },
  { src: '/photos/photo5.jpg', caption: 'Mis juguetes 🦀', placeholderAnimal: '/animals/pulpo.png', bg: 'linear-gradient(135deg,#b8e8f0,#5aab7a)', portrait: false },
]

// Tallest portrait aspect ratio is 1064:1600 ≈ 0.665
// Widest landscape is 1600:1064 ≈ 1.504
// We cap portrait slides so they don't exceed 80vh on small screens.

function PhotoSlide({
  photo, isActive, index,
}: {
  photo: typeof GALLERY_PHOTOS[0]
  isActive: boolean
  index: number
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div
      className="relative w-full"
      style={{
        // Dynamic aspect ratio per orientation
        //aspectRatio: photo.portrait ? '1064 / 1600' : '1600 / 1064',
        // Never taller than 80dvh so portrait shots stay within screen on iPhone
        height: '1600px',
        maxHeight: '80dvh',
        background: photo.bg,
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      {/* ── Real photo (object-fit: contain — never clips) ── */}
      {!error && (
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          style={{
            objectFit: 'contain',   // whole photo always visible
            objectPosition: 'center center',
          }}
          priority={index === 0}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {/* ── Placeholder shown while loading or on error ── */}
      {(!loaded || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={{ y: isActive ? [0, -10, 0] : 0 }}
            transition={{ duration: 3, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
          >
            <Image
              src={photo.placeholderAnimal}
              alt={photo.caption}
              width={140}
              height={120}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.2))' }}
            />
          </motion.div>
          <p className="font-bubble font-bold text-lg text-white text-center px-6"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
            {photo.caption}
          </p>
          <p className="text-white/60 text-sm font-body">Foto #{index + 1}</p>
        </div>
      )}

      {/* ── Caption overlay shown once photo loads ── */}
      {loaded && !error && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{
            background: 'linear-gradient(to top, rgba(13,74,98,0.65) 0%, transparent 100%)',
            borderRadius: '0 0 20px 20px',
          }}
        >
          <p className="font-bubble font-bold text-base text-white text-center"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            {photo.caption}
          </p>
        </div>
      )}

      {/* ── Shimmer on active slide ── */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.08) 50%,transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite',
          }}
        />
      )}
    </div>
  )
}

export default function PhotoGallery({ onNav }: { onNav?: () => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => { sfx.slide(); emblaApi?.scrollPrev(); onNav?.() }, [emblaApi, onNav])
  const scrollNext = useCallback(() => { sfx.slide(); emblaApi?.scrollNext(); onNav?.() }, [emblaApi, onNav])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    // Re-init when slide sizes change (different aspect ratios)
    emblaApi.on('reInit', onSelect)

    const timer = setInterval(() => {
      emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0)
    }, 4500)

    return () => {
      clearInterval(timer)
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="font-bubble font-bold text-2xl" style={{ color: '#1d6d87' }}>
          📸 Nuestro álbum del mar
        </h2>
        <p className="text-sm font-body" style={{ color: '#3a9ab5' }}>
          Un año de aventuras oceánicas 🌊
        </p>
      </div>

      {/* Carousel — no fixed height, slides size themselves */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container items-center">
          {GALLERY_PHOTOS.map((photo, index) => (
            <div key={index} className="embla__slide" style={{ padding: '0 8px' }}>
              <motion.div
                animate={{
                  scale: index === selectedIndex ? 1 : 0.93,
                  opacity: index === selectedIndex ? 1 : 0.65,
                }}
                transition={{ duration: 0.35 }}
                style={{
                  borderRadius: '20px',
                  boxShadow: index === selectedIndex
                    ? '0 10px 40px rgba(13,74,98,0.28)'
                    : '0 4px 16px rgba(13,74,98,0.12)',
                  border: '3px solid rgba(255,255,255,0.85)',
                  overflow: 'hidden',
                  // Let the slide define its own height via aspect-ratio
                  width: '100%',
                }}
              >
                <PhotoSlide photo={photo} isActive={index === selectedIndex} index={index} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: 'rgba(255,255,255,0.82)',
            border: '2px solid rgba(110,198,216,0.5)',
            boxShadow: '0 4px 12px rgba(58,154,181,0.2)',
            color: '#3a9ab5', fontSize: '22px', fontWeight: 'bold',
          }}
        >‹</button>

        <div className="flex gap-2 items-center">
          {GALLERY_PHOTOS.map((_, index) => (
            <button
              key={index}
              onClick={() => { sfx.slide(); emblaApi?.scrollTo(index); onNav?.() }}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === selectedIndex ? '20px' : '8px',
                height: '8px',
                background: index === selectedIndex ? '#3a9ab5' : 'rgba(110,198,216,0.4)',
              }}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: 'rgba(255,255,255,0.82)',
            border: '2px solid rgba(110,198,216,0.5)',
            boxShadow: '0 4px 12px rgba(58,154,181,0.2)',
            color: '#3a9ab5', fontSize: '22px', fontWeight: 'bold',
          }}
        >›</button>
      </div>
    </div>
  )
}
