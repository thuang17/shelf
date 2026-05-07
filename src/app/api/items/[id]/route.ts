import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ItemStatus } from '@/types'

async function validateToken(itemId: string, editToken: string): Promise<boolean> {
  const { data: item } = await supabase
    .from('items').select('shelf_id').eq('id', itemId).single()
  if (!item) return false

  const { data: shelf } = await supabase
    .from('shelves').select('edit_token').eq('id', item.shelf_id).single()
  return shelf?.edit_token === editToken
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { editToken, status } = await req.json()
  if (!(await validateToken(id, editToken))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('items')
    .update({ status: status as ItemStatus })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { editToken } = await req.json()
  if (!(await validateToken(id, editToken))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ success: true })
}
