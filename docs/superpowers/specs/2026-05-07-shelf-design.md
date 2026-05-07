# Shelf — Design Doc

## Context

A minimalist personal media tracker for books, movies, and series. Users create a beautiful public "shelf" to log what they're reading/watching, have finished, or want to get to. The shelf is shareable via a public URL — no account required.

**Priority 1:** Stunning, minimal dark UI (Netflix aesthetic, flow.rest philosophy).  
**Priority 2:** Useful, frictionless tracking.

---

## Product Name

**shelf**

---

## Core User Flow

1. Visit homepage → click "Create your shelf"
2. Enter a name/slug → shelf created instantly at `shelf.so/trevor`
3. Receive an edit URL (secret token in URL, no login needed)
4. Search and add books, movies, or series
5. Set status per item: Reading / Watching / Finished / Want to
6. Share the public URL with anyone

---

## Pages

| Page | Description |
|------|-------------|
| **Homepage** | Minimal landing — one headline, one CTA ("Create your shelf") |
| **Shelf view** | Public-facing Netflix-style rows: Books row, Movies & Series row |
| **Edit mode** | Same shelf view with edit controls, accessible via secret edit URL |
| **Add item modal** | Search field → results list → select → set status → add |

---

## Visual Design

- **Background:** `#141414` (Netflix black)
- **Layout:** Horizontal rows by category (Books / Movies & Series)
- **Cards:** Cover image fills the card; no text visible by default
- **Hover:** Gradient overlay fades in with title, creator, status dot
- **Status dot:** Small colored circle on card corner (blue = reading/watching, muted = want to)
- **Filter bar:** All · Books · Movies · Series · Reading · Finished · Want to
- **Typography:** System sans-serif, minimal hierarchy, light on dark

---

## Data Model

**shelf**
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| slug | text | URL identifier e.g. `trevor` |
| owner_name | text | Display name |
| edit_token | text | Secret for edit access |
| created_at | timestamp | |

**item**
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| shelf_id | uuid | FK → shelf |
| type | enum | `book`, `movie`, or `series` |
| external_id | text | Open Library ID or TMDB ID |
| title | text | |
| creator | text | Author or director |
| cover_url | text | Poster/cover image URL |
| year | text | Publication or release year |
| status | enum | `reading`, `watching`, `finished`, `want_to_read`, `want_to_watch` — books use `reading`/`want_to_read`; movies & series use `watching`/`want_to_watch` |
| position | integer | Manual ordering within row |
| created_at | timestamp | |

---

## External APIs

| API | Used for | Auth |
|-----|----------|------|
| Open Library Search API | Book search + cover images | None (free, open) |
| TMDB API | Movie + series search, poster images | Free API key |

---

## Out of Scope (MVP)

- User authentication / accounts
- Ratings and notes
- Social features (following, discovery feed)
- Multiple shelves per user
- Music / other media types beyond books, movies, series
- Mobile app

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js + Tailwind CSS |
| Database + backend | Supabase |
| Book data | Open Library API |
| Movie data | TMDB API |
| Deployment | Vercel |

---

## Verification

1. Create a shelf → confirm public URL works in incognito window
2. Search for a book → add it → appears in Books row
3. Search for a movie → add it → appears in Movies & Series row
3b. Search for a series → add it → appears in Movies & Series row
4. Change item status → reflects immediately in UI
5. Filter by Books / Movies / status → correct items shown
6. Visit edit URL → edit controls visible; visit public URL → no edit controls
