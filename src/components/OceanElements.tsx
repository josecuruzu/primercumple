'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function Whale({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/ballena.png" alt="ballena" width={140} height={96} className={className} style={{ objectFit: 'contain', ...style }} priority />
}
export function Seahorse({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/seahorse.png" alt="caballito de mar" width={80} height={110} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function Turtle({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/tortuga.png" alt="tortuga" width={120} height={84} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function Crab({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/cangrejo.png" alt="cangrejo" width={100} height={92} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function Starfish({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/estrella_De_mar.png" alt="estrella de mar" width={90} height={90} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function Jellyfish({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/medusa.png" alt="medusa" width={80} height={100} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function Octopus({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/pulpo.png" alt="pulpo" width={100} height={95} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function Lobster({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/langosta.png" alt="langosta" width={100} height={100} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function SeaUrchin({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/erizo_de_mar.png" alt="erizo de mar" width={80} height={80} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function FishStriped({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/pez_a_rayas.png" alt="pez a rayas" width={110} height={76} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function FishNemo({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/pez_nemo.png" alt="pez nemo" width={110} height={76} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function FishSpotted({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/pez_pecas.png" alt="pez pecas" width={110} height={88} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function FishColor({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/pez_color.png" alt="pez color" width={100} height={72} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function Pufferfish({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/pez_globo.png" alt="pez globo" width={90} height={78} className={className} style={{ objectFit: 'contain', ...style }} />
}
export function FishBlue({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <Image src="/animals/pez_rayado.png" alt="pez rayado azul" width={100} height={70} className={className} style={{ objectFit: 'contain', ...style }} />
}

export function Seaweed({ className = '', variant = 1, style }: { className?: string; variant?: number; style?: React.CSSProperties }) {
  const colors = ['#4aab6a', '#5ab87a', '#3a9a5a', '#6abb80']
  const c = colors[variant % colors.length]
  return (
    <svg className={className} style={style} viewBox="0 0 40 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {variant === 1 && <>
        <path d="M 20 120 Q 10 100 20 80 Q 30 60 20 40 Q 10 20 20 5" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <ellipse cx="8" cy="70" rx="10" ry="6" fill={c} transform="rotate(-20 8 70)" opacity="0.9"/>
        <ellipse cx="30" cy="45" rx="10" ry="6" fill={c} transform="rotate(25 30 45)" opacity="0.9"/>
        <ellipse cx="12" cy="20" rx="9" ry="6" fill={c} transform="rotate(-15 12 20)" opacity="0.9"/>
      </>}
      {variant === 2 && <>
        <path d="M 20 120 Q 28 95 20 75 Q 12 55 22 35 Q 30 15 20 5" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <ellipse cx="30" cy="65" rx="11" ry="7" fill={c} transform="rotate(20 30 65)" opacity="0.9"/>
        <ellipse cx="14" cy="40" rx="11" ry="7" fill={c} transform="rotate(-25 14 40)" opacity="0.9"/>
        <ellipse cx="26" cy="18" rx="9" ry="6" fill={c} transform="rotate(15 26 18)" opacity="0.9"/>
      </>}
      {variant === 3 && <>
        <path d="M 20 120 Q 5 95 15 70 Q 25 45 15 20 Q 10 8 20 2" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <ellipse cx="28" cy="80" rx="14" ry="8" fill={c} transform="rotate(30 28 80)" opacity="0.8"/>
        <ellipse cx="10" cy="55" rx="13" ry="8" fill={c} transform="rotate(-20 10 55)" opacity="0.8"/>
        <ellipse cx="24" cy="30" rx="12" ry="7" fill={c} transform="rotate(25 24 30)" opacity="0.8"/>
        <ellipse cx="12" cy="10" rx="10" ry="6" fill={c} transform="rotate(-10 12 10)" opacity="0.8"/>
      </>}
    </svg>
  )
}

export function Coral({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 40 100 L 40 60" stroke="#4aabb0" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 40 80 Q 25 65 15 50 Q 20 48 25 55 Q 30 62 40 72Z" fill="#3a9ba0"/>
      <path d="M 40 72 Q 55 55 65 42 Q 60 40 55 47 Q 48 56 40 64Z" fill="#4aabb0"/>
      <path d="M 40 60 Q 28 45 20 32 Q 25 30 29 37 Q 34 46 40 54Z" fill="#5abbc0" opacity="0.8"/>
      <path d="M 40 54 Q 52 38 60 28 Q 55 26 51 33 Q 46 42 40 50Z" fill="#3a9ba0" opacity="0.8"/>
      <circle cx="15" cy="50" r="4" fill="#5acbd0"/>
      <circle cx="65" cy="42" r="4" fill="#5acbd0"/>
      <circle cx="20" cy="32" r="3" fill="#5acbd0"/>
      <circle cx="60" cy="28" r="3" fill="#5acbd0"/>
    </svg>
  )
}

export function Bubbles() {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; delay: number; duration: number }[]>([])
  useEffect(() => {
    setBubbles(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 8 + Math.random() * 20,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
    })))
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((b) => (
        <div key={b.id} className="absolute rounded-full" style={{
          left: `${b.x}%`, bottom: '-60px',
          width: `${b.size}px`, height: `${b.size}px`,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(110,198,216,0.15))',
          border: '1px solid rgba(255,255,255,0.6)',
          animation: `bubble ${b.duration}s linear ${b.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

export function GaelTitle() {
  return (
    <div className="relative select-none">
      <h1 className="text-7xl font-bubble font-extrabold tracking-wider watercolor-text" style={{
        filter: 'drop-shadow(0 3px 6px rgba(58,154,181,0.3)) drop-shadow(0 0 20px rgba(110,198,216,0.2))',
        letterSpacing: '0.05em',
      }}>
        Gael
      </h1>
      {[15, 38, 55, 72].map((left, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: `${left}%`, top: `${-8 - i * 4}px`,
          width: `${6 + i * 2}px`, height: `${6 + i * 2}px`,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(110,198,216,0.3))',
          border: '1.5px solid rgba(255,255,255,0.7)',
        }} />
      ))}
    </div>
  )
}
