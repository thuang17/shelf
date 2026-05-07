import { NextResponse } from 'next/server'
import { searchBooks } from '@/lib/openLibrary'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')
  if (!q) return NextResponse.json([])
  return NextResponse.json(await searchBooks(q))
}
