'use client'

export type FilterValue = 'all' | 'books' | 'movies' | 'series' | 'reading' | 'finished' | 'want'

const TYPE_FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Books', value: 'books' },
  { label: 'Movies', value: 'movies' },
  { label: 'Series', value: 'series' },
]

const STATUS_FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'Reading', value: 'reading' },
  { label: 'Finished', value: 'finished' },
  { label: 'Want to', value: 'want' },
]

interface FilterBarProps {
  active: FilterValue
  onChange: (v: FilterValue) => void
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  const btnStyle = (v: FilterValue) => ({
    background: active === v ? 'var(--surface)' : 'transparent',
    color: active === v ? 'var(--text-primary)' : 'var(--text-secondary)',
    letterSpacing: '-0.01em',
  })

  return (
    <div className="flex items-center gap-0.5 px-12 pb-6">
      {TYPE_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className="px-3 py-1.5 rounded-md text-xs transition-colors"
          style={btnStyle(f.value)}
        >
          {f.label}
        </button>
      ))}
      <span className="inline-block w-px h-3.5 mx-2" style={{ background: 'var(--border)' }} />
      {STATUS_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className="px-3 py-1.5 rounded-md text-xs transition-colors"
          style={btnStyle(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
