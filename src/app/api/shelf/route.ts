import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { supabase } from '@/lib/supabase'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
}

export async function POST(req: Request) {
  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }

  const baseSlug = slugify(name)
  if (!baseSlug) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }

  let slug = baseSlug
  let attempt = 0
  while (true) {
    const { data } = await supabase.from('shelves').select('id').eq('slug', slug).single()
    if (!data) break
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const editToken = nanoid(24)

  const { data: shelf, error } = await supabase
    .from('shelves')
    .insert({ slug, owner_name: name.trim(), edit_token: editToken })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })

  return NextResponse.json({ slug: shelf.slug, editToken: shelf.edit_token })
}
