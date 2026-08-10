# Tea Tech Talks (TTT)

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion.

## What's included in this milestone

- **Home** (`/`) — hero, stats, about preview, live activities, features, testimonials, FAQ, sponsors, final CTA
- **Activities** (`/activities`) — activity cards (Typing Challenge, Tech Quiz)
- **Leaderboard** (`/leaderboard`) — animated podium (top 3) + searchable/sortable table (weekly/monthly/overall)
- **Login** (`/login`) — matches your wireframe (email/password + Google button, UI only)
- Shared `Navbar` / `Footer`, design tokens in `app/globals.css` (white / black / `#D90429` red)
- `prisma/schema.prisma` — full relational schema (User, Activity, TypingResult, Quiz, QuizResult, Badge, Certificate, Notification, CommitteeMember)

All content on Home/Activities/Leaderboard currently reads from `lib/mock-data.ts` — swap these for real API/Prisma calls once the backend milestone starts.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Next milestones (not yet built)

- NextAuth (Google OAuth + email/password), protected routes, session management
- Real database wiring via Prisma + Supabase Postgres (`DATABASE_URL` in `.env`)
- Typing test engine (WPM/accuracy calculation) and Quiz engine
- Profile dashboard, Admin dashboard
- About page full content (mission, committee, gallery, timeline)

## Env vars you'll need later

```
DATABASE_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_URL=
```
