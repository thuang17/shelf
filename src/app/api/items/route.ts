import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import type { ItemType, ItemStatus } from '@/types'

export async function POST(req: Request) {
  const { slug, editToken, item } = await req.json()

  const { data: shelf } = await getSupabase()
    .from('shelves').select('id, edit_token').eq('slug', slug).single()

  if (!shelf || shelf.edit_token !== editToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await getSupabase()
    .from('items')
    .insert({
      shelf_id: shelf.id,
      type: item.type as ItemType,
      external_id: item.external_id,
      title: item.title,
      creator: item.creator,
      cover_url: item.cover_url ?? null,
      year: item.year ?? null,
      status: item.status as ItemStatus,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to add' }, { status: 500 })
  return NextResponse.json(data)
}
