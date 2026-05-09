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
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xs text-center">
        <h1
          className="mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '44px',
            fontWeight: 700,
            color: '#f8fafc',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}
        >
          shelf
        </h1>
        <p
          className="mb-8 text-xs uppercase"
          style={{
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '2px',
          }}
        >
          Your Personal Collection
        </p>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="w-full text-center text-sm outline-none py-2.5 mb-1 rounded-lg"
              style={{
                background: 'var(--bg)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            />
            {error && (
              <p className="text-xs mt-2" style={{ color: '#f87171' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold mt-4 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: '#f8fafc',
                color: '#080808',
                fontFamily: 'var(--font-body)',
              }}
            >
              {loading ? 'Creating...' : 'Create Shelf'}
            </button>
          </form>
        </div>

        <p
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.12)', fontFamily: 'var(--font-body)' }}
        >
          No account needed
        </p>
      </div>
    </main>
  )
}
