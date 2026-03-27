# 🌊 Gael - Libro de Visitas · Primer Añito

App de libro de visitas con temática oceánica para el primer cumpleaños de Gael. 
Optimizada para iPhone. Desplegada en Vercel + Supabase.

## ✨ Funcionalidades

- 📸 **Galería tipo slide** con fotos pre-cargadas del cumpleañero (auto-scroll cada 4 segundos)
- 💌 **Formulario de mensajes** con nombre, texto y foto opcional
- 📷 **Cámara directa** desde el iPhone (capture="environment")
- 🖼️ **Galería del dispositivo** para subir fotos existentes
- 🌊 **Animaciones oceánicas**: ballena, caballito de mar, tortuga, cangrejo, peces, algas
- 🫧 **Burbujas animadas** en el fondo
- 💾 **Tiempo real**: los mensajes se guardan en Supabase

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS + CSS custom animations
- **Animaciones**: Framer Motion
- **Carousel**: Embla Carousel (muy rápido en iOS)
- **Backend/DB**: Supabase (PostgreSQL + Storage)
- **Deploy**: Vercel
- **Fuentes**: Baloo 2 (títulos) + Nunito (texto)

---

## 🚀 Instrucciones de Despliegue

### 1. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo
2. En **SQL Editor**, ejecuta el contenido de `supabase-setup.sql`
3. En **Settings > API**, copia:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Añadir fotos de Gael

Coloca las fotos en `public/photos/`:
```
public/photos/photo1.jpg
public/photos/photo2.jpg
public/photos/photo3.jpg
...
```

O edita `src/components/PhotoGallery.tsx` para usar URLs de Supabase Storage.

### 3. Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# En la carpeta del proyecto
vercel

# Añadir variables de entorno cuando te las pida, o ve al dashboard
```

O conecta el repositorio GitHub directamente en [vercel.com](https://vercel.com).

**Variables de entorno en Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Desarrollo local

```bash
npm install
cp .env.local.example .env.local
# Rellena las variables en .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📱 Optimizaciones iOS

- `font-size: 16px` en inputs (evita zoom automático de Safari)
- `maximum-scale=1` en viewport
- `overscroll-behavior: none` (sin rebote excesivo)
- `-webkit-tap-highlight-color: transparent`
- `env(safe-area-inset-bottom)` para el botón flotante (notch safety)
- `capture="environment"` para cámara trasera directa
- PWA ready con `apple-mobile-web-app-capable`

---

## 🎨 Personalización

### Cambiar los textos de las fotos
Edita `GALLERY_PHOTOS` en `src/components/PhotoGallery.tsx`

### Cambiar colores
Edita `src/app/globals.css` (variables CSS) y `tailwind.config.js`

### Añadir más fotos de invitados en la galería
Las fotos subidas por invitados están en Supabase Storage > `gael-photos`

---

## 🗄️ Estructura de base de datos

```sql
messages {
  id: UUID (primary key)
  created_at: TIMESTAMPTZ
  guest_name: TEXT
  message: TEXT
  photo_url: TEXT | NULL  -- URL pública de Supabase Storage
}
```

---

¡Feliz primer añito Gael! 🐋🌊
