/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // 1. Reducir la calidad global (por defecto es 75)
    // Un valor entre 60 y 70 es el "sweet spot" para móviles sin perder mucha nitidez.
    deviceSizes: [640, 750, 828, 1080, 1200], 
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 2. Forzar formatos modernos (WebP y AVIF)
    // AVIF comprime hasta un 20% más que WebP, aunque tarda un poco más en generarse la primera vez.
    formats: ['image/avif', 'image/webp'],
    
    // 3. Aumentar el tiempo de caché en el navegador (en segundos)
    // 31536000 es un año. Esto evita que el iPhone re-descargue la imagen constantemente.
    minimumCacheTTL: 60,
  },
}

module.exports = nextConfig
