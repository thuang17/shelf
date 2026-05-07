'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/shelf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    router.push(`/${data.slug}?edit=${data.editToken}`)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-xs">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
        >
          shelf
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          Your books, movies, and series — beautifully displayed.
        </p>

        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          {error && (
            <p className="text-xs" style={{ color: '#e05555' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
            style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}
          >
            {loading ? 'Creating…' : 'Create your shelf →'}
          </button>
        </form>
      </div>
    </main>
  )
}
