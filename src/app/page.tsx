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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '0 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '320px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '44px',
          fontWeight: 700,
          color: '#f8fafc',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
          margin: '0 0 24px',
        }}>
          shelf
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: '0 0 32px',
        }}>
          Your Personal Collection
        </p>

        <div style={{
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          width: '100%',
          maxWidth: '320px',
        }}>
          <form onSubmit={handleCreate} style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                fontSize: '14px',
                outline: 'none',
                padding: '10px 0',
                marginBottom: '4px',
                borderRadius: '8px',
                background: 'var(--bg)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            />
            {error && (
              <p style={{ color: '#f87171', fontSize: '12px', margin: '8px 0 0' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={!name.trim() || loading}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                marginTop: '16px',
                transition: 'all 0.2s',
                opacity: (!name.trim() || loading) ? 0.4 : 1,
                cursor: (!name.trim() || loading) ? 'not-allowed' : 'pointer',
                background: '#f8fafc',
                color: '#080808',
                fontFamily: 'var(--font-body)',
                border: 'none',
              }}
            >
              {loading ? 'Creating...' : 'Create Shelf'}
            </button>
          </form>
        </div>

        <p style={{
          color: 'rgba(255,255,255,0.12)',
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
        }}>
          No account needed
        </p>
      </div>
    </div>
  )
}
