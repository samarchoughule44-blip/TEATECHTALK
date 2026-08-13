# 🚀 Setup Guide — Tea Tech Talks Activity Room System

## Step 1: Restore Supabase Project (if paused)

1. Go to https://supabase.com/dashboard/project/diebyxrgvqozawwysjgk
2. If paused, click **Restore Project**
3. Wait ~2 minutes for the project to come back online

---

## Step 2: Push Database Schema

Once the project is active, run:

```bash
npx prisma db push
```

This will create all the required tables in your Supabase PostgreSQL database.

---

## Step 3: Seed Quiz Questions

```bash
npm run seed
```

This will populate 20 technical quiz questions in the `RoomQuizQuestion` table.

---

## Step 4: Enable Realtime on Tables

In your Supabase dashboard:

1. Go to **Database → Replication**
2. Enable **Realtime** for these tables:
   - `Room`
   - `RoomParticipant`
   - `RoomFinalResult`
3. Save changes

This enables the live admin dashboard and waiting room updates.

---

## Step 5: Create Admin User

1. Sign up at http://localhost:3000/signup with your email
2. In Supabase SQL Editor, run:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

---

## Step 6: Start the Dev Server

```bash
npm run dev
```

---

## 🗺 Route Map

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/join` | Participant join form (desktop-only) |
| `/admin` | Admin dashboard (requires ADMIN role) |
| `/room/[roomCode]/waiting` | Waiting room (session-authenticated) |
| `/room/[roomCode]/typing` | Typing test (active rooms only) |
| `/room/[roomCode]/quiz` | Technical quiz (after typing test) |
| `/room/[roomCode]/completed` | Results & score breakdown |
| `/room/[roomCode]/leaderboard` | Live leaderboard |

---

## 📋 Admin Flow

1. Log in → go to `/admin`
2. Click **Create Room** → configure durations → get Room ID (e.g. `TECH2026`)
3. Share Room ID with participants
4. Watch participants join in real-time
5. Click **Start Activity** when ready
6. Participants are automatically redirected to Typing Test
7. Monitor progress in the dashboard
8. Use **Lock Room** to stop new joiners
9. Click **Close Room** when done

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `DATABASE_URL` | Supabase Session Pooler URL (port 5432) |
| `DIRECT_URL` | Direct DB connection URL (for CLI migrations) |
