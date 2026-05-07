import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: shelf } = await getSupabase()
    .from('shelves').select('id').eq('slug', slug).single()

  if (!shelf) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: items } = await getSupabase()
    .from('items')
    .select('*')
    .eq('shelf_id', shelf.id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ items: items ?? [] })
}
