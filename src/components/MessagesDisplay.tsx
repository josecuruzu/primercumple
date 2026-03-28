'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, type Message } from '@/lib/supabase'
import Image from 'next/image'

export default function MessagesDisplay({ refresh }: { refresh: number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setMessages(data)
      }
      setLoading(false)
    }

    fetchMessages()
  }, [refresh])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-5xl"
        >
          🐠
        </motion.div>
        <p className="font-body text-sm" style={{ color: '#6ec6d8' }}>
          Cargando mensajes del fondo del mar...
        </p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <span className="text-5xl">🐚</span>
        <p className="font-bubble font-bold text-lg text-center" style={{ color: '#3a9ab5' }}>
          ¡Sé el primero en dejar<br/>un mensaje para Gael!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bubble font-bold text-2xl text-center" style={{ color: '#1d6d87' }}>
        💌 Mensajitos con amor
      </h2>
      <AnimatePresence>
        {messages.map((msg, i) => (
  <motion.div
    key={msg.id}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: i * 0.05, duration: 0.4 }}
    className="rounded-3xl overflow-hidden relative mb-4"
    style={{
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(10px)',
      border: '1.5px solid rgba(255,255,255,0.9)',
      boxShadow: '0 8px 25px rgba(58,154,181,0.15)',
    }}
  >
    {/* Contenedor de Imagen y Mensaje Superpuesto */}
    <div className="relative w-full min-h-[250px] flex items-center justify-center bg-black/5">
      {msg.photo_url ? (
        <Image
          src={msg.photo_url}
          alt={`Foto de ${msg.guest_name}`}
          fill
          className="object-contain" // Muestra la foto completa sin cortes
          unoptimized // Úsalo si tienes problemas de dominios con Next.js Image
        />
      ) : (
        <div className="py-12 text-4xl opacity-20">🌊</div>
      )}

      {/* Capa de texto (Subtítulos) */}
      <div 
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{
          background: 'linear-gradient(to top, rgba(13,74,98,0.85) 0%, rgba(13,74,98,0.4) 40%, transparent 100%)'
        }}
      >
        <p className="text-white font-body text-base leading-snug text-center mb-2 italic"
           style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          "{msg.message}"
        </p>
        
        {/* Nombre del invitado */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: 'linear-gradient(135deg, #6ec6d8, #3a9ab5)',
              color: 'white',
            }}>
            {msg.guest_name.charAt(0).toUpperCase()}
          </div>
          <p className="font-bubble font-bold text-sm text-white/90">
            {msg.guest_name}
          </p>
        </div>
      </div>
    </div>

    {/* Fecha (opcional, en la parte inferior o pequeña) */}
    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
      <p className="text-[10px] text-white/80">
        {new Date(msg.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
      </p>
    </div>
  </motion.div>
))}
      </AnimatePresence>
    </div>
  )
}
