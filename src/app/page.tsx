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
          className="mb-8"
          style={{
            fontSize: '36px',
            fontWeight: 200,
            color: 'var(--text-primary)',
            letterSpacing: '-0.8px',
          }}
        >
          shelf
        </h1>

        <form
          onSubmit={handleCreate}
          className="glass rounded-xl p-6"
          style={{ borderRadius: '14px' }}
        >
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            className="w-full text-center text-sm outline-none pb-2 mb-4"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
            }}
          />
          {error && (
            <p className="text-xs mb-3" style={{ color: '#e05555' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
            }}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </main>
  )
}
