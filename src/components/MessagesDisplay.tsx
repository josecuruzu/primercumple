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
    <div className="relative w-full overflow-hidden">
      <h2 className="font-bubble font-bold text-2xl text-center mb-4" style={{ color: '#1d6d87' }}>
        💌 Mensajitos con amor
      </h2>
      
      {/* Contenedor de Scroll Lateral Optimizado para iOS */}
      <div 
        className="flex overflow-x-auto gap-4 pb-8 px-4 hide-scrollbar snap-x snap-mandatory"
        style={{ 
          WebkitOverflowScrolling: 'touch', 
          scrollBehavior: 'smooth',
          display: 'flex'
        }}
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              // flex-shrink-0 y w-[85vw] permiten que se asome la siguiente tarjeta
              className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center rounded-3xl overflow-hidden relative shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255,255,255,0.8)',
                transform: 'translateZ(0)' // Mejora rendimiento en Safari
              }}
            >
              <div className="relative w-full flex flex-col">
                {msg.photo_url ? (
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={msg.photo_url}
                      alt={msg.guest_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d4a62]/90 via-[#0d4a62]/20 to-transparent z-10" />
                  </div>
                ) : (
                  <div className="h-[180px] flex items-center justify-center text-3xl opacity-20 bg-white/30">🌊</div>
                )}

                <div className={msg.photo_url ? "absolute bottom-0 left-0 right-0 z-20 p-5" : "relative p-5"}>
                  <p 
                    className={`text-center italic mb-4 font-medium leading-tight ${msg.photo_url ? 'text-white' : 'text-[#0d4a62]'}`}
                    style={{ textShadow: msg.photo_url ? '0 2px 4px rgba(0,0,0,0.5)' : 'none' }}
                  >
                    "{msg.message}"
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2 text-left">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6ec6d8] to-[#3a9ab5] flex items-center justify-center text-white text-xs font-bold">
                        {msg.guest_name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-bold text-sm ${msg.photo_url ? 'text-white' : 'text-[#1d6d87]'}`}>
                        {msg.guest_name}
                      </span>
                    </div>
                    <span className={`text-[10px] ${msg.photo_url ? 'text-white/70' : 'text-[#6ec6d8]'}`}>
                      {new Date(msg.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Espaciador final para que la última tarjeta no se corte en Safari */}
        <div className="flex-shrink-0 w-4" />
      </div>

      {/* Estilos para ocultar la barra de scroll */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
