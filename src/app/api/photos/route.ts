import { readdirSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

export async function GET() {
  try {
    const photosDir = join(process.cwd(), 'public', 'photos')
    const files = readdirSync(photosDir)
      .filter(f => IMAGE_EXTS.has(f.slice(f.lastIndexOf('.')).toLowerCase()))
      .sort()
      .map(f => `/photos/${f}`)

    return NextResponse.json(files)
  } catch {
    return NextResponse.json([])
  }
}
