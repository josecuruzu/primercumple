'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { sfx } from '@/lib/audio'

// ── Placeholder animals cycling per slide index ──
const PLACEHOLDER_ANIMALS = [
  '/animals/ballena.png',
  '/animals/tortuga.png',
  '/animals/pez_nemo.png',
  '/animals/pez_pecas.png',
  '/animals/pulpo.png',
  '/animals/langosta.png',
  '/animals/seahorse.png',
]

const SLIDE_BG = ['#3a9ab5','#5aab7a','#c85040','#6ec6d8','#1d6d87','#e8805a','#5aab7a']

// ── Animals filling the top/bottom bands of landscape photos ──
const TOP_ANIMALS    = ['/animals/estrella_De_mar.png', '/animals/medusa.png',   '/animals/pez_color.png']
const BOTTOM_ANIMALS = ['/animals/cangrejo.png',        '/animals/seahorse.png', '/animals/erizo_de_mar.png']

function TopBottomAnimals({ idx }: { idx: number }) {
  const top    = TOP_ANIMALS[idx % TOP_ANIMALS.length]
  const bottom = BOTTOM_ANIMALS[idx % BOTTOM_ANIMALS.length]
  return (
    <>
      <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center justify-around px-8"
        style={{ top: 0, height: '27%', background: 'linear-gradient(to bottom,rgba(0,0,0,0.18) 0%,transparent 100%)' }}>
        {[0,1,2].map(i => (
          <motion.div key={i}
            animate={{ y: [0,-8,0] }}
            transition={{ duration: 3+i*0.8, repeat: Infinity, delay: i*0.9, ease: 'easeInOut' }}>
            <Image src={top} alt="" width={58} height={58}
              style={{ objectFit:'contain', filter:'drop-shadow(0 3px 8px rgba(0,0,0,0.3))' }}/>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center justify-around px-8"
        style={{ bottom: 0, height: '27%', background: 'linear-gradient(to top,rgba(0,0,0,0.18) 0%,transparent 100%)' }}>
        {[0,1,2].map(i => (
          <motion.div key={i}
            animate={{ y: [0,8,0] }}
            transition={{ duration: 3.5+i*0.7, repeat: Infinity, delay: i*1.1, ease: 'easeInOut' }}>
            <Image src={bottom} alt="" width={58} height={58}
              style={{ objectFit:'contain', filter:'drop-shadow(0 3px 8px rgba(0,0,0,0.3))' }}/>
          </motion.div>
        ))}
      </div>
    </>
  )
}

// ── Single slide ──
function PhotoSlide({ src, index, isActive }: { src: string; index: number; isActive: boolean }) {
  const [loaded,      setLoaded]      = useState(false)
  const [error,       setError]       = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setIsLandscape(img.naturalWidth > img.naturalHeight)
    setLoaded(true)
  }

  const bg      = SLIDE_BG[index % SLIDE_BG.length]
  const animal  = PLACEHOLDER_ANIMALS[index % PLACEHOLDER_ANIMALS.length]
  // Extract filename without extension as caption fallback
  const caption = src.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') ?? `Foto ${index + 1}`

  return (
    <div className="relative w-full h-full" style={{ background: bg }}>

      {/* Top/bottom animals for landscape photos — detected automatically */}
      {isLandscape && loaded && !error && <TopBottomAnimals idx={index} />}

      {/* Real photo */}
      {!error && (
        <Image
          src={src}
          alt={caption}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          priority={index === 0}
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          onLoad={handleLoad}
          onError={() => setError(true)}
        />
      )}

      {/* Placeholder while loading */}
      {(!loaded || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
          <motion.div
            animate={{ y: isActive ? [0,-12,0] : 0 }}
            transition={{ duration: 3, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}>
            <Image src={animal} alt="" width={160} height={140}
              style={{ objectFit:'contain', filter:'drop-shadow(0 6px 18px rgba(0,0,0,0.25))' }}/>
          </motion.div>
          {error && (
            <p className="font-body text-white/70 text-sm">No se pudo cargar la foto</p>
          )}
        </div>
      )}

      {/* Caption bar */}
      {loaded && !error && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20"
          style={{ background: 'linear-gradient(to top,rgba(13,74,98,0.72) 0%,transparent 100%)' }}>
          <p className="font-bubble font-bold text-base text-white text-center"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            {caption}
          </p>
        </div>
      )}

      {/* Active shimmer */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: 'linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.07) 50%,transparent 70%)',
          backgroundSize: '200% 100%', animation: 'shimmer 4s infinite',
        }}/>
      )}
    </div>
  )
}

// ── Loading skeleton ──
function GalleryLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-16"
      style={{ aspectRatio: '1363/2048', maxHeight: '72dvh',
        background: 'rgba(255,255,255,0.35)', borderRadius: '20px',
        border: '3px solid rgba(255,255,255,0.88)' }}>
      <motion.div animate={{ y: [0,-14,0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        <Image src="/animals/ballena.png" alt="" width={110} height={76} style={{ objectFit: 'contain' }}/>
      </motion.div>
      <p className="font-bubble font-bold text-lg" style={{ color: '#3a9ab5' }}>
        Cargando fotos… 🌊
      </p>
    </div>
  )
}

// ── Empty state ──
function GalleryEmpty() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-16"
      style={{ aspectRatio: '1363/2048', maxHeight: '72dvh',
        background: 'rgba(255,255,255,0.35)', borderRadius: '20px',
        border: '3px dashed rgba(110,198,216,0.5)' }}>
      <span className="text-5xl">🐚</span>
      <p className="font-bubble font-bold text-xl text-center px-8" style={{ color: '#3a9ab5' }}>
        Aún no hay fotos
      </p>
      <p className="font-body text-sm text-center px-10" style={{ color: '#6ec6d8' }}>
        Coloca las imágenes en<br/><code className="font-mono text-xs">public/photos/</code>
      </p>
    </div>
  )
}

// ── Main component ──
export default function PhotoGallery({ onNav }: { onNav?: () => void }) {
  const [photos,       setPhotos]       = useState<string[]>([])
  const [fetchStatus,  setFetchStatus]  = useState<'loading' | 'ready' | 'empty'>('loading')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoplay, setAutoplay]           = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Fetch photo list from API ──
  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.json())
      .then((list: string[]) => {
        if (list.length > 0) { setPhotos(list); setFetchStatus('ready') }
        else                 { setFetchStatus('empty') }
      })
      .catch(() => setFetchStatus('empty'))
  }, [])

  // ── Embla ──
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', dragFree: false })

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (emblaApi) emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0)
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
    return () => { stopTimer(); emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect) }
  }, [emblaApi, onSelect, autoplay, startTimer, stopTimer])

  const toggleAutoplay = () => {
    sfx.pop()
    if (autoplay) { stopTimer(); setAutoplay(false) }
    else          { setAutoplay(true) }
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

      {/* ── States ── */}
      {fetchStatus === 'loading' && <GalleryLoading />}
      {fetchStatus === 'empty'   && <GalleryEmpty />}

      {/* ── Carousel — only when photos are ready ── */}
      {fetchStatus === 'ready' && (
        <>
          {/* Container portrait-shaped: 1363×2048 */}
          <div style={{
            width: '100%', aspectRatio: '1363/2048', maxHeight: '72dvh',
            position: 'relative', borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(13,74,98,0.28)',
            border: '3px solid rgba(255,255,255,0.88)',
          }}>
            <div ref={emblaRef} style={{ width:'100%', height:'100%', overflow:'hidden' }}>
              <div style={{ display:'flex', height:'100%' }}>
                {photos.map((src, index) => (
                  <div key={src} style={{ flex:'0 0 100%', minWidth:0, height:'100%', position:'relative' }}>
                    <motion.div style={{ width:'100%', height:'100%' }}
                      animate={{ scale: index===selectedIndex ? 1 : 0.97, opacity: index===selectedIndex ? 1 : 0.55 }}
                      transition={{ duration: 0.3 }}>
                      <PhotoSlide src={src} index={index} isActive={index===selectedIndex} />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {/* Dots — max 7 visible to avoid overflow */}
            <div className="flex gap-2 items-center">
              {photos.slice(0, 7).map((_, i) => (
                <button key={i}
                  onClick={() => { sfx.slide(); emblaApi?.scrollTo(i); onNav?.() }}
                  style={{
                    width: i===selectedIndex ? '20px' : '8px', height: '8px',
                    borderRadius: '4px', border:'none', padding:0, cursor:'pointer',
                    background: i===selectedIndex ? '#3a9ab5' : 'rgba(110,198,216,0.4)',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
              {/* Counter when more than 7 photos */}
              {photos.length > 7 && (
                <span className="font-body text-xs ml-1" style={{ color: '#6ec6d8' }}>
                  {selectedIndex + 1}/{photos.length}
                </span>
              )}
            </div>

            {/* Play / Pause */}
            <motion.button whileTap={{ scale: 0.88 }} onClick={toggleAutoplay}
              aria-label={autoplay ? 'Pausar' : 'Reproducir'}
              style={{
                position:'relative', width:'44px', height:'44px', borderRadius:'50%',
                background: autoplay ? 'linear-gradient(135deg,#6ec6d8,#3a9ab5)' : 'rgba(255,255,255,0.82)',
                border: autoplay ? '2px solid rgba(255,255,255,0.5)' : '2px solid rgba(110,198,216,0.5)',
                boxShadow: autoplay ? '0 4px 14px rgba(58,154,181,0.4)' : '0 4px 12px rgba(58,154,181,0.15)',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', flexShrink:0,
              }}>
              <AnimatePresence mode="wait">
                {autoplay ? (
                  <motion.svg key="pause" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    transition={{ duration:0.15 }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="2" width="4" height="12" rx="1.5" fill="white"/>
                    <rect x="9" y="2" width="4" height="12" rx="1.5" fill="white"/>
                  </motion.svg>
                ) : (
                  <motion.svg key="play" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    transition={{ duration:0.15 }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 2.5 L13 8 L4 13.5 Z" fill="#3a9ab5"/>
                  </motion.svg>
                )}
              </AnimatePresence>
              {autoplay && (
                <motion.div style={{ position:'absolute', inset:0, borderRadius:'50%',
                  border:'2px solid rgba(110,198,216,0.6)' }}
                  animate={{ scale:[1,1.5,1], opacity:[0.7,0,0.7] }}
                  transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
                />
              )}
            </motion.button>
          </div>

          <p className="text-center text-xs mt-2 font-body" style={{ color: 'rgba(58,154,181,0.55)' }}>
            desliza para ver más fotos 👆
          </p>
        </>
      )}
    </div>
  )
}
