# Shelf UI Redesign Spec

## Goal

Redesign Shelf's visual identity and interactions to create a distinctive personal media gallery that differentiates from Douban/Goodreads-style list-based catalogs.

## Design Direction

**Dark Editorial Gallery × Glass Texture**

- Dark background (`#0a0a0b`), no background glow effects
- Glassmorphism on navigation and modals only (not cards)
- Cover-first layout — covers are the visual protagonist, text is minimal
- Curated gallery feel, not a database list
- No page transitions — dark background provides natural seamlessness between pages

## Differentiation from Douban

| Douban | Shelf (new) |
|--------|-------------|
| White/light background | Deep dark (`#0a0a0b`) |
| List layout, small cover + dense text | 5-column cover grid, text minimal |
| Rating/comment/social driven | Personal curation, no social noise |
| Green accent | Blue accent (`#4fa3e0`) |
| Feature-dense, complex | Clean, breathing room |

## Pages

### Homepage (`/`)

- Centered layout, vertically centered
- Large "shelf" title in 200 weight, letter-spacing -0.8px
- Glass card containing name input + "create" button
- Input: transparent with bottom border only
- No footer text, no feature list, no tagline

### Shelf Page (`/[slug]`)

- **Nav bar:** glass texture (`backdrop-filter: blur(16px)`), shows "shelf / {name}" + share/add buttons
- **Filter tabs:** pill/capsule buttons (20px radius), active state has glass background
- **Layout:** 5-column CSS Grid, 10-12px gap
- **Sections:** "Books" and "Movies & Series" with item count
- **Empty state:** centered muted text
- **Edit mode empty slot:** dashed border "+" placeholder

### Not Found

Next.js default 404 page (no custom design needed for MVP).

## Components

### MediaCard

- **Aspect ratio:** 2/3
- **Default state:** gradient placeholder background (varies by item for visual variety) + optional cover image
- **Title/creator:** gradient overlay at bottom of card (always visible)
- **Status dot:** small colored dot top-right for active items (reading/watching)
- **Status label:** below card, small muted text with status dot
- **Hover:** card lifts 4px (translateY), shadow deepens, border brightens (0.2s ease)
- **Edit mode hover:** full-card semi-transparent dark overlay, status dropdown + delete button appear
- **Public mode:** no edit controls, status dot only

### ShelfRow

- Section title ("Books" / "Movies & Series") + item count
- 5-column grid of MediaCards
- Returns null when items array is empty

### FilterBar

- Pill buttons: All / Books / Movies / Series | Reading / Finished / Want to
- Active: glass background, primary text color
- Inactive: transparent, muted text color
- Type filters separated from status filters by a thin divider

### AddItemModal

- Glass background card (`backdrop-filter: blur(16px)`), centered
- Tab bar at top: "Books" / "Movies & Series"
- Search input with glass styling
- Results list (max 8), each with small cover thumbnail + title + creator/year
- Selected result shows status dropdown + "Add" button
- Backdrop click to dismiss
- Auto-focus search input on open

## Interactions

### Included
- Card hover: lift + shadow (CSS transition 0.2s ease)
- Edit mode hover: overlay with controls
- Filter tabs: instant switch, no animation
- Modal: open/close, no transition animation

### Excluded (YAGNI)
- Page transitions — dark bg is seamless
- Card mount/unmount animations — direct, no motion
- Toast notifications — operations reflected inline (delete = gone, add = appears)
- framer-motion — zero additional animation dependencies
- Skeleton loaders — SSR delivers content fast enough
- Loading spinners — handled by button text change ("Adding…")

## Visual System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| --bg | `#0a0a0b` | Page background |
| --surface | `#141414` | Card backgrounds |
| --border | `rgba(255,255,255,0.06)` | Subtle borders |
| text-primary | `rgba(255,255,255,0.8)` | Headings, active text |
| text-secondary | `rgba(255,255,255,0.3)` | Body text, labels |
| text-muted | `rgba(255,255,255,0.15)` | Counts, meta |
| accent-blue | `#4fa3e0` | Active status, links |
| accent-green | `#4a9e6b` | Finished status |
| glass-bg | `rgba(255,255,255,0.02)` | Glass container background |
| glass-border | `rgba(255,255,255,0.06)` | Glass container border |

### Typography

- Font stack: `-apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif`
- Homepage title: 200 weight, 32-36px, letter-spacing -0.8px
- Nav: 500 weight, 14-15px, letter-spacing -0.3px
- Card titles: 600 weight, 9-11px
- Body: 400 weight, 11-13px
- Meta/counts: 400 weight, 9-11px, muted color

### Glass Implementation

```css
backdrop-filter: blur(16px);
background: rgba(255, 255, 255, 0.02);
border: 1px solid rgba(255, 255, 255, 0.06);
```

Applied to: navigation bar, AddItemModal. NOT applied to individual cards (performance).

### Spacing

| Element | Value |
|---------|-------|
| Page horizontal padding | 32px |
| Card gap | 10-12px |
| Section gap | 36-48px |
| Nav height | ~52px |
| Card border-radius | 8px |
| Button/Modal border-radius | 8-12px |
| Pill/tag border-radius | 20px |

### Responsive Notes

- 5-column grid on desktop (≥1280px)
- Below that: auto-fit with min-width on cards (~140px), letting the grid naturally reduce columns
- No mobile-specific design for MVP — but layout shouldn't break on smaller viewports

## What We're NOT Doing

- Light mode
- Mobile navigation (hamburger, etc.)
- Custom 404 page
- Loading skeletons
- Page transitions / framer-motion
- Background glow effects
- Footer or tagline text on homepage
- Stats dashboard cards
- Horizontal scrolling rows
