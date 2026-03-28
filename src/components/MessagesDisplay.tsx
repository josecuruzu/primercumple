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
    className="rounded-3xl overflow-hidden relative mb-5 group" // 'group' para efectos al pasar el mouse si quieres
    style={{
      background: 'rgba(255,255,255,0.6)', // Más translúcido para que se vea el fondo marino
      backdropFilter: 'blur(12px)',
      border: '1.5px solid rgba(255,255,255,0.7)',
      boxShadow: '0 10px 30px rgba(58,154,181,0.12)',
    }}
  >
    {/* Contenedor Principal Adaptable */}
    <div className="relative w-full flex flex-col">
      
      {msg.photo_url ? (
        /* CASO CON FOTO: La foto manda en el tamaño */
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden"> 
          {/* aspect-[3/4] es ideal para fotos verticales de móvil */}
          <Image
            src={msg.photo_url}
            alt={`Foto de ${msg.guest_name}`}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105" 
            // object-cover llena el espacio. object-center centra la cara.
            unoptimized 
          />
          {/* Degradado oscuro superpuesto para legibilidad del texto */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(to top, rgba(13,74,98,0.9) 0%, rgba(13,74,98,0.5) 30%, transparent 60%)'
            }}
          />
        </div>
      ) : (
        /* CASO SIN FOTO: Espaciador decorativo mínimo */
        <div className="pt-10 pb-2 text-center text-4xl opacity-15">🌊</div>
      )}

      {/* Contenedor de Texto (Subtítulos) - Posicionado Absoluto sobre la foto o Relativo si no hay foto */}
      <div className={`${msg.photo_url ? 'absolute bottom-0 left-0 right-0 z-20' : 'relative'} p-5`}>
        
        {/* Mensaje */}
        <p className={`${msg.photo_url ? 'text-white' : 'text-[#0d4a62]'} font-body text-base leading-relaxed text-center mb-3 italic`}
           style={{ 
             textShadow: msg.photo_url ? '0 2px 4px rgba(0,0,0,0.6)' : 'none',
             fontFamily: "'Nunito', sans-serif" 
           }}>
          "{msg.message}"
        </p>
        
        {/* Info del Invitado (Nombre + Fecha alineados) */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t"
             style={{ borderColor: msg.photo_url ? 'rgba(255,255,255,0.2)' : 'rgba(110,198,216,0.3)' }}>
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-inner"
              style={{
                background: 'linear-gradient(135deg, #6ec6d8, #3a9ab5)',
                color: 'white',
                fontFamily: "'Baloo 2', cursive",
              }}>
              {msg.guest_name.charAt(0).toUpperCase()}
            </div>
            <p className={`font-bubble font
      </AnimatePresence>
    </div>
  )
}
