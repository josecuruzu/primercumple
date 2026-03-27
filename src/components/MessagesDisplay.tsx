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
        💌 Mensajes con amor
      </h2>
      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 20px rgba(58,154,181,0.12)',
            }}
          >
            {/* Photo if exists */}
            {msg.photo_url && (
              <div className="relative w-full" style={{ height: '200px' }}>
                <Image
                  src={msg.photo_url}
                  alt={`Foto de ${msg.guest_name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.6) 100%)'
                }}/>
              </div>
            )}

            <div className="p-4">
              {/* Name + fish icon */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #6ec6d8, #3a9ab5)',
                    color: 'white',
                    fontFamily: "'Baloo 2', cursive",
                  }}>
                  {msg.guest_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bubble font-bold text-base leading-tight" style={{ color: '#1d6d87' }}>
                    {msg.guest_name}
                  </p>
                  <p className="text-xs" style={{ color: '#6ec6d8' }}>
                    {new Date(msg.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Message */}
              <p className="font-body text-sm leading-relaxed pl-11" style={{ color: '#0d4a62' }}>
                {msg.message}
              </p>

              {/* Decorative wave */}
              <div className="flex justify-end mt-2 opacity-30">
                <svg width="40" height="10" viewBox="0 0 40 10">
                  <path d="M 0 5 Q 5 0 10 5 Q 15 10 20 5 Q 25 0 30 5 Q 35 10 40 5"
                    stroke="#6ec6d8" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
