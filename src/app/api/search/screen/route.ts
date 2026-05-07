import { NextResponse } from 'next/server'
import { searchScreen } from '@/lib/tmdb'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')
  if (!q) return NextResponse.json([])
  return NextResponse.json(await searchScreen(q))
}
