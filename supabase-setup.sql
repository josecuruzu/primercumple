-- =============================================
-- GAEL CUMPLEAÑOS - SUPABASE SETUP
-- Ejecuta este SQL en el editor de Supabase
-- =============================================

-- 1. Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT
);

-- 2. Habilitar Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Política: Cualquiera puede leer mensajes
CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT
  USING (true);

-- 4. Política: Cualquiera puede insertar mensajes
CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- =============================================
-- STORAGE: Crear bucket para fotos
-- =============================================
-- Ve a Storage > New Bucket en el dashboard de Supabase
-- Nombre: gael-photos
-- Public: ✅ habilitado
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- Max file size: 5MB

-- Después ejecuta estas políticas de storage:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gael-photos',
  'gael-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Política de storage: Lectura pública
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gael-photos');

-- Política de storage: Cualquiera puede subir
CREATE POLICY "Anyone can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gael-photos');

-- =============================================
-- OPCIONAL: Ver mensajes ordenados
-- =============================================
CREATE OR REPLACE VIEW messages_view AS
SELECT
  id,
  created_at,
  guest_name,
  message,
  photo_url,
  LENGTH(message) as message_length
FROM messages
ORDER BY created_at DESC;
