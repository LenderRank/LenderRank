# LenderRep — Project Brief

> Share this file at the start of every Claude session to provide full context.  
> Claude should update this file at the end of each session.

---

## What Is This

LenderRep is a review and discovery platform for licensed mortgage loan officers. Homebuyers search for top-rated loan officers by city, read verified client reviews, and leave their own reviews. Loan officers can claim their profile and collect reviews to build reputation.

**Live site:** Deployed on Vercel via GitHub → [LenderRank/LenderRank](https://github.com/LenderRank/LenderRank)  
**Local path:** `E:\Visual Studio\Work\lenderrep`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.2 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Database / Auth | Supabase (`@supabase/supabase-js` v2, `@supabase/ssr`) |
| Fonts | Geist Sans + Geist Mono (via `next/font/google`) |
| Deployment | Vercel (auto-deploys from `main` branch) |

**Important Next.js 16 notes:**
- `params` in dynamic routes are now a `Promise` — must `await params` before accessing slug
- Read `node_modules/next/dist/docs/` before writing new Next.js patterns

---

## Pages Built

| Route | File | Type | Status |
|---|---|---|---|
| `/` | `app/page.tsx` | Server Component | ✅ Live data |
| `/loan-officers/raleigh-nc` | `app/loan-officers/raleigh-nc/page.tsx` | Server Component | ✅ Live data |
| `/loan-officers/[slug]` | `app/loan-officers/[slug]/page.tsx` | Server Component | ✅ Live data |
| `/leave-review` | `app/leave-review/page.tsx` | Client Component | ✅ Saves to DB |
| `/sign-in` | `app/sign-in/page.tsx` | Client Component | ✅ |
| `/sign-up` | `app/sign-up/page.tsx` | Client Component | ✅ |
| `/admin` | `app/admin/page.tsx` | Client Component | ✅ Auth-gated |

---

## Components

| Component | File | Notes |
|---|---|---|
| `Navbar` | `app/components/Navbar.tsx` | Client; shows auth state, includes ThemeToggle |
| `ThemeToggle` | `app/components/ThemeToggle.tsx` | Client; sun/moon toggle, reads/writes localStorage |

---

## Supabase Database

**Project URL:** `https://eythuyarzbjbstdbnzow.supabase.co`  
**Schema + seed files:** `supabase/schema.sql` and `supabase/seed.sql`

### Tables

**`loan_officers`**
```
id, name, slug (unique), company, city, state, initials,
avatar_color (Tailwind classes, e.g. "bg-green-100 text-green-900"),
nmls_id, bio, avg_rating, review_count, ranking_score,
years_experience, specialties (text[]), is_verified, is_claimed, created_at
```

**`reviews`**
```
id, loan_officer_id (FK), reviewer_id (FK → auth.users),
reviewer_name, rating (1–5), review_text, loan_type, closing_date,
nmls_submitted, city, state, is_approved, is_confirmed, created_at
```

**`profiles`**
```
id (FK → auth.users), email, first_name, last_name,
role ('homebuyer' | 'loan_officer'), created_at
```

### Ranking Algorithm
`ranking_score = avg_rating * ln(review_count + 1)`  
Recalculated by admin when a review is approved.

### RLS Summary
- `loan_officers` — public SELECT; authenticated UPDATE
- `reviews` — public SELECT (approved only); authenticated INSERT/UPDATE/DELETE; authenticated SELECT (all)
- `profiles` — authenticated users read/write own row

### Seeded Data
4 Raleigh, NC officers: Sarah Johnson, Mark Chen, Diana Patel, Tom Rivera

---

## Authentication

- Supabase Auth (email/password)
- Sign-up creates a row in `profiles` table
- `Navbar` detects session via `supabase.auth.getSession()` + `onAuthStateChange`
- Leave-review page redirects to `/sign-in` if no session
- Admin page redirects to `/sign-in` if no session (no role check yet — any authenticated user can access)

---

## Dark Mode

- **Config:** `tailwind.config.js` sets `darkMode: 'selector'` → loaded in `globals.css` via `@config`
- **How it works:** Toggling adds/removes `.dark` class on `<html>`; Tailwind compiles `dark:` utilities as `&:where(.dark, .dark *)` selectors
- **Persistence:** Saved to `localStorage` as `'dark'` or `'light'`
- **Flash prevention:** Inline `<script>` in `<head>` (in `layout.tsx`) runs before hydration to apply saved theme; `suppressHydrationWarning` on `<html>` suppresses the resulting React mismatch warning
- **Toggle button:** `ThemeToggle` component in `Navbar` — moon icon in light mode, sun icon in dark mode
- **Coverage:** All pages have `dark:` classes

---

## Key Files

```
app/
  layout.tsx              Root layout; anti-flash script; suppressHydrationWarning
  globals.css             @import tailwindcss; @config tailwind.config.js
  page.tsx                Homepage — fetches top 4 officers by ranking_score
  components/
    Navbar.tsx            Auth state + ThemeToggle
    ThemeToggle.tsx       Dark mode button
  lib/
    supabase.ts           Supabase client (uses NEXT_PUBLIC_ env vars)
  loan-officers/
    raleigh-nc/page.tsx   City listing — fetches officers WHERE city=Raleigh, state=NC
    [slug]/page.tsx       Profile page — fetches officer + approved reviews by slug
  leave-review/page.tsx   4-step review submission form
  sign-in/page.tsx
  sign-up/page.tsx
  admin/page.tsx          Review approval + officer listing dashboard
supabase/
  schema.sql              Run first — creates tables + RLS policies
  seed.sql                Run second — inserts 4 Raleigh officers (idempotent via DELETE+INSERT)
tailwind.config.js        darkMode: 'selector'
```

---

## Environment Variables

Stored in `.env.local` (not committed):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Known Gaps / Future Work

- [ ] Admin page has no role check — any signed-in user can access `/admin`
- [ ] Search bar on homepage is non-functional (UI only)
- [ ] Filter buttons on Raleigh city page are UI-only (no actual filtering)
- [ ] Review form does not collect reviewer city/state (displayed conditionally in profile)
- [ ] `/claim`, `/states`, `/account`, `/forgot-password` routes do not exist yet
- [ ] Only Raleigh, NC has data — "Browse by state" section is hardcoded placeholder counts
- [ ] No email notifications when a review is submitted or approved
- [ ] No way for loan officers to confirm transactions from their side

---

## Session Log

### Session 1 — Initial build
Built homepage, loan officer profile page, Raleigh city page, sign-in, sign-up, leave-review (multi-step), admin dashboard, Navbar with auth state.

### Session 2 — Supabase integration
- Created `supabase/schema.sql` and `supabase/seed.sql`
- Connected homepage and Raleigh city page to live Supabase data (were hardcoded)
- Profile page and review form were already wired to Supabase
- Added `avatar_color` column to `loan_officers` for per-officer card colors
- Seed script is idempotent (DELETE + INSERT)

### Session 3 — Dark mode
- Added `ThemeToggle` component (sun/moon SVG icons) to `Navbar`
- Configured `darkMode: 'selector'` via `tailwind.config.js` + `@config` in `globals.css`
  - Note: `@custom-variant dark` CSS directive does NOT override Tailwind v4's built-in dark variant — must use the JS config approach
- Added `suppressHydrationWarning` on `<html>` to silence React mismatch from anti-flash script
- Applied `dark:` classes across all 7 pages and both components
- Fixed hydration mismatch error caused by anti-flash script modifying `<html>` className
