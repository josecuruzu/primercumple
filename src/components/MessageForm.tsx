'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { sfx } from '@/lib/audio'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface MessageFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function MessageForm({ onClose, onSuccess }: MessageFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (file: File | null) => {
    if (!file) return
    sfx.camera()
    setPhoto(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      sfx.error()
      toast.error('¡Por favor escribe tu nombre! 🐠')
      return
    }
    if (!message.trim()) {
      sfx.error()
      toast.error('¡No olvides dejar tu mensaje! 💌')
      return
    }

    setLoading(true)
    try {
      let photo_url: string | null = null

      if (photo) {
        const ext = photo.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('gael-photos')
          .upload(fileName, photo, { contentType: photo.type })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('gael-photos').getPublicUrl(fileName)
        photo_url = data.publicUrl
      }

      const { error } = await supabase.from('messages').insert([
        { guest_name: name.trim(), message: message.trim(), photo_url }
      ])

      if (error) throw error

      sfx.success()
      toast.success('¡Mensaje enviado con mucho amor! 🐳💙', { duration: 4000 })
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      sfx.error()
      toast.error('Ups, algo salió mal. ¡Intenta de nuevo! 🦀')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{ background: 'rgba(13,74,98,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) { sfx.close(); onClose() } }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(232,247,249,0.98) 0%, rgba(184,232,240,0.95) 100%)',
            border: '1.5px solid rgba(255,255,255,0.9)',
            boxShadow: '0 -8px 40px rgba(13,74,98,0.2)',
          }}
        >
          {/* Header */}
          <div className="relative p-6 pb-4" style={{
            background: 'linear-gradient(135deg, #6ec6d8 0%, #3a9ab5 100%)',
          }}>
            {/* Decorative bubbles */}
            {[10, 30, 55, 75, 90].map((left, i) => (
              <div key={i} className="absolute rounded-full" style={{
                left: `${left}%`, top: `${8 + i * 3}px`,
                width: `${6 + i * 2}px`, height: `${6 + i * 2}px`,
                background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)',
              }}/>
            ))}
            <button
              onClick={() => { sfx.close(); onClose() }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <span className="text-white font-bold text-lg leading-none">×</span>
            </button>
            <h2 className="font-bubble font-bold text-2xl text-white text-center" style={{
              textShadow: '0 2px 8px rgba(13,74,98,0.3)'
            }}>
              ¡Deja tu mensaje! 💌
            </h2>
            <p className="text-center text-white/80 text-sm mt-1 font-body">
              para el primer añito de Gael 🐠
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            {/* Name */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#1d6d87', fontFamily: "'Nunito', sans-serif" }}>
                🐚 Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
                maxLength={50}
                className="w-full rounded-2xl px-4 py-3.5 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '2px solid rgba(110,198,216,0.4)',
                  color: '#0d4a62',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '16px',
                }}
                onFocus={e => e.target.style.border = '2px solid #6ec6d8'}
                onBlur={e => e.target.style.border = '2px solid rgba(110,198,216,0.4)'}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#1d6d87', fontFamily: "'Nunito', sans-serif" }}>
                🌊 Tu mensaje para Gael
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe algo especial para este marinero de 1 año... ⚓"
                maxLength={300}
                rows={4}
                className="w-full rounded-2xl px-4 py-3.5 outline-none resize-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '2px solid rgba(110,198,216,0.4)',
                  color: '#0d4a62',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '16px',
                }}
                onFocus={e => e.target.style.border = '2px solid #6ec6d8'}
                onBlur={e => e.target.style.border = '2px solid rgba(110,198,216,0.4)'}
              />
              <p className="text-right text-xs mt-1" style={{ color: '#6ec6d8' }}>
                {message.length}/300
              </p>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#1d6d87', fontFamily: "'Nunito', sans-serif" }}>
                📸 Añade una foto (opcional)
              </label>

              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden" style={{ height: '180px' }}>
                  <Image src={photoPreview} alt="preview" fill style={{ objectFit: 'cover' }}/>
                  <button
                    onClick={() => { sfx.pop(); setPhoto(null); setPhotoPreview(null) }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'rgba(240,107,138,0.9)' }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* Camera button */}
                  <button
                    onClick={() => { sfx.pop(); cameraInputRef.current?.click() }}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      border: '2px dashed rgba(110,198,216,0.6)',
                    }}
                  >
                    <span className="text-3xl">📷</span>
                    <span className="text-xs font-bold" style={{ color: '#3a9ab5' }}>Tomar foto</span>
                  </button>
                  {/* Gallery button */}
                  <button
                    onClick={() => { sfx.pop(); fileInputRef.current?.click() }}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      border: '2px dashed rgba(90,171,122,0.6)',
                    }}
                  >
                    <span className="text-3xl">🖼️</span>
                    <span className="text-xs font-bold" style={{ color: '#3a9ab5' }}>Desde galería</span>
                  </button>
                </div>
              )}

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => handlePhotoChange(e.target.files?.[0] || null)}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handlePhotoChange(e.target.files?.[0] || null)}
              />
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bubble font-bold text-xl text-white transition-all duration-200"
              style={{
                background: loading
                  ? 'rgba(110,198,216,0.5)'
                  : 'linear-gradient(135deg, #6ec6d8 0%, #3a9ab5 100%)',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(58,154,181,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    🌀
                  </motion.span>
                  Enviando...
                </span>
              ) : (
                '¡Enviar con amor! 🐋'
              )}
            </motion.button>

            <div className="pb-safe" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
