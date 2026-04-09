# LenderRep — Project Brief

> Share this file at the start of every Claude session to provide full context.  
> Claude should update this file at the end of each session.

---

## Standing Instructions

These apply every session, no exceptions:

- **Never guess or assume.** If something is unclear, stop and ask before proceeding.
- **Verify over speed.** It is always better to take extra time to verify than to build something wrong.
- **Read before writing.** Before writing any new code, read the relevant existing files first.
- **Present options, don't pick silently.** If two approaches exist, present the options and ask which to use.

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
| `/search` | `app/search/page.tsx` | Server Component | ✅ Live data |
| `/loan-officers/raleigh-nc` | `app/loan-officers/raleigh-nc/page.tsx` | Client Component | ✅ Live data + filters |
| `/loan-officers/[slug]` | `app/loan-officers/[slug]/page.tsx` | Server Component | ✅ Live data |
| `/leave-review` | `app/leave-review/page.tsx` | Client Component | ✅ Saves to DB |
| `/sign-in` | `app/sign-in/page.tsx` | Client Component | ✅ |
| `/sign-up` | `app/sign-up/page.tsx` | Client Component | ✅ |
| `/admin` | `app/admin/page.tsx` | Client Component | ✅ Role-gated |
| `/claim` | `app/claim/page.tsx` | Client Component | ✅ NMLS lookup + claim flow |
| `/account` | `app/account/page.tsx` | Client Component | ✅ Auth-gated |
| `/forgot-password` | `app/forgot-password/page.tsx` | Client Component | ✅ |

---

## Components

| Component | File | Notes |
|---|---|---|
| `Navbar` | `app/components/Navbar.tsx` | Client; shows auth state, includes ThemeToggle |
| `ThemeToggle` | `app/components/ThemeToggle.tsx` | Client; sun/moon toggle, reads/writes localStorage |
| `Footer` | `app/components/Footer.tsx` | Server; NMLS disclaimer + LenderRep logo link; used on all pages |

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
role ('homebuyer' | 'loan_officer'), claimed_nmls_id, created_at
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
- Admin page redirects to `/sign-in` if no session; then checks `profiles.role === 'loan_officer'` or `NEXT_PUBLIC_ADMIN_EMAIL` match — everyone else redirected to homepage

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
  page.tsx                Homepage — fetches top 4 officers; search via next/form → /search
  search/page.tsx         Search results — queries Supabase by name/city/state via ?q=
  components/
    Navbar.tsx            Auth state + ThemeToggle
    ThemeToggle.tsx       Dark mode button
    Footer.tsx            NMLS disclaimer + logo; used on all 11 pages
  lib/
    supabase.ts           Supabase client (uses NEXT_PUBLIC_ env vars)
  loan-officers/
    raleigh-nc/page.tsx   City listing — Client Component; client-side specialty filters
    [slug]/page.tsx       Profile page — fetches officer + approved reviews by slug
  leave-review/page.tsx   4-step review submission form
  sign-in/page.tsx
  sign-up/page.tsx
  admin/page.tsx          Review approval + officer listing; role-gated (loan_officer or ADMIN_EMAIL)
  claim/page.tsx          Claim profile landing page
  account/page.tsx        Edit first/last name; link to forgot-password
  forgot-password/page.tsx  Supabase resetPasswordForEmail flow
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
NEXT_PUBLIC_ADMIN_EMAIL=...   # email address that can access /admin regardless of role
```

---

## Known Gaps / Future Work

- [ ] Review form does not collect reviewer city/state (displayed conditionally in profile)
- [ ] `/states` route does not exist yet
- [ ] Only Raleigh, NC has data — "Browse by state" section is hardcoded placeholder counts
- [ ] No email notifications when a review is submitted or approved
- [ ] No way for loan officers to confirm transactions from their side
- [ ] Account page cannot change email (Supabase requires separate verification flow)
- [ ] No email notifications when a review is submitted or approved (email infra not set up)

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

### Session 4 — Auth hardening, search, filters, missing routes
- **Admin role check:** `/admin` now checks `profiles.role === 'loan_officer'` OR `session.user.email === NEXT_PUBLIC_ADMIN_EMAIL`; all others redirected to homepage
- **Search:** Homepage search bar wired up via `next/form` → `/search?q=`; results page queries Supabase with `.ilike` on name, city, state
- **Raleigh filters:** Converted `raleigh-nc/page.tsx` from Server to Client Component; filters apply client-side against the fetched officer list; active specialty highlighted on each card
- **New pages:** `/claim` (loan officer CTA), `/account` (edit name, link to change password), `/forgot-password` (Supabase resetPasswordForEmail with success state)
- **Added env var:** `NEXT_PUBLIC_ADMIN_EMAIL` controls admin access bypass by email

### Session 6 — Global footer with NMLS disclaimer
- Created `Footer` component (`app/components/Footer.tsx`) with NMLS Consumer Access disclaimer and LenderRep logo link
- Replaced inline `<footer>` blocks on all 8 pages that had them (homepage, sign-in, sign-up, leave-review, Raleigh city page, profile page, account, claim)
- Added `<Footer />` to 3 pages that previously had no footer (search, forgot-password, admin)
- Restructured `forgot-password` layout from `flex items-center justify-center` to `flex flex-col` with a `flex-1` centering wrapper so the footer renders at the bottom
- Disclaimer text: "License information sourced from NMLS Consumer Access. LenderRep is not affiliated with or endorsed by the Nationwide Multistate Licensing System."

### Session 5 — Standing instructions
- Added permanent **Standing Instructions** section to top of `LENDERREP.md` (never guess/assume; verify over speed; read before writing; present options don't pick silently)
- Fixed stale note in Authentication section — admin role check was added in Session 4

### Session 7 — Real claim flow with NMLS verification
- **`/claim` full rewrite:** Converted from static Server Component to multi-step Client Component
  - Step 1: NMLS ID input → queries `loan_officers` table via `.eq('nmls_id', ...)`
  - Step 2a (found): Profile preview card (initials, name, company, city/state, NMLS) + "Create account to claim" / "I already have an account" buttons; shows warning if already claimed
  - Step 2b (not found): "We don't have your profile yet" message + email input → saves to `claim_waitlist` table → confirmation screen
  - All steps wrapped in `<Suspense>` per Next.js 16 requirement for `useSearchParams` in production builds
- **`/sign-up` updates:** Reads `?nmls=` param; if present, shows claim banner, locks role to `loan_officer`, stores `claimed_nmls_id` in profile insert, and links success screen to `/sign-in?nmls=X`
- **`/sign-in` updates:** Reads `?nmls=` param; after successful sign-in, runs `completeClaim()` which sets `loan_officers.is_claimed = true` (only if currently false) and sets `profiles.role = 'loan_officer'` + clears `claimed_nmls_id`; also checks `profiles.claimed_nmls_id` as fallback for users returning from email confirmation without the URL param; redirects to `/account` after a claim, `/` otherwise
- **Schema additions** (run in Supabase SQL Editor):
  ```sql
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS claimed_nmls_id TEXT;
  CREATE TABLE IF NOT EXISTS claim_waitlist (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email            TEXT NOT NULL,
    nmls_id_entered  TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
  );
  ALTER TABLE claim_waitlist ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public insert claim_waitlist" ON claim_waitlist FOR INSERT WITH CHECK (true);
  CREATE POLICY "Authenticated read claim_waitlist" ON claim_waitlist FOR SELECT TO authenticated USING (true);
  ```
- **Known limitation:** Claim finalizes at sign-in (after email confirmation), not automatically on email confirmation itself — would require a server-side auth callback with service role key to automate fully
