import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ShelfClient from './ShelfClient'
import type { Shelf, Item } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function ShelfPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { edit: editParam } = await searchParams

  const { data: shelf } = await supabase
    .from('shelves')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!shelf) notFound()

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('shelf_id', shelf.id)
    .order('created_at', { ascending: true })

  const editToken = editParam ?? null
  const isEditing = editToken === shelf.edit_token

  return (
    <ShelfClient
      shelf={shelf as Shelf}
      initialItems={(items ?? []) as Item[]}
      isEditing={isEditing}
      editToken={isEditing ? editToken! : null}
    />
  )
}
