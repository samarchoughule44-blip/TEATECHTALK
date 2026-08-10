-- ============================================================
-- TEA TECH TALK — Activity Room System Tables
-- Paste this ENTIRE file into Supabase SQL Editor and Run
-- ============================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE "RoomStatus" AS ENUM ('WAITING', 'ACTIVE', 'COMPLETED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "ParticipantStatus" AS ENUM ('JOINED', 'TYPING', 'TYPING_DONE', 'QUIZ', 'COMPLETED', 'LEFT', 'DISCONNECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Room table
CREATE TABLE IF NOT EXISTS "Room" (
  "id"             TEXT NOT NULL,
  "roomCode"       TEXT NOT NULL,
  "status"         "RoomStatus" NOT NULL DEFAULT 'WAITING',
  "allowJoining"   BOOLEAN NOT NULL DEFAULT true,
  "createdById"    TEXT,
  "typingDuration" INTEGER NOT NULL DEFAULT 60,
  "quizDuration"   INTEGER NOT NULL DEFAULT 900,
  "typingWeight"   FLOAT8 NOT NULL DEFAULT 0.5,
  "quizWeight"     FLOAT8 NOT NULL DEFAULT 0.5,
  "maxScore"       INTEGER NOT NULL DEFAULT 200,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "startedAt"      TIMESTAMPTZ,
  "endedAt"        TIMESTAMPTZ,
  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Room_roomCode_key" ON "Room"("roomCode");
CREATE INDEX IF NOT EXISTS "Room_roomCode_idx" ON "Room"("roomCode");
CREATE INDEX IF NOT EXISTS "Room_status_idx" ON "Room"("status");

-- Participants table
CREATE TABLE IF NOT EXISTS "RoomParticipant" (
  "id"              TEXT NOT NULL,
  "roomId"          TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "participantCode" TEXT NOT NULL,
  "status"          "ParticipantStatus" NOT NULL DEFAULT 'JOINED',
  "sessionToken"    TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "joinedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "completedAt"     TIMESTAMPTZ,
  "lastSeenAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "RoomParticipant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RoomParticipant_sessionToken_key"          ON "RoomParticipant"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "RoomParticipant_roomId_participantCode_key" ON "RoomParticipant"("roomId", "participantCode");
CREATE INDEX IF NOT EXISTS "RoomParticipant_roomId_idx"      ON "RoomParticipant"("roomId");
CREATE INDEX IF NOT EXISTS "RoomParticipant_sessionToken_idx" ON "RoomParticipant"("sessionToken");

ALTER TABLE "RoomParticipant"
  ADD CONSTRAINT "RoomParticipant_roomId_fkey"
  FOREIGN KEY ("roomId") REFERENCES "Room"("id")
  ON DELETE CASCADE ON UPDATE CASCADE
  NOT VALID;

-- Typing results table
CREATE TABLE IF NOT EXISTS "RoomTypingResult" (
  "id"            TEXT NOT NULL,
  "roomId"        TEXT NOT NULL,
  "participantId" TEXT NOT NULL,
  "wpm"           FLOAT8 NOT NULL,
  "accuracy"      FLOAT8 NOT NULL,
  "errors"        INTEGER NOT NULL,
  "correctChars"  INTEGER NOT NULL,
  "totalChars"    INTEGER NOT NULL,
  "score"         FLOAT8 NOT NULL,
  "completedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "RoomTypingResult_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RoomTypingResult_participantId_key" ON "RoomTypingResult"("participantId");
CREATE INDEX IF NOT EXISTS "RoomTypingResult_roomId_idx" ON "RoomTypingResult"("roomId");

ALTER TABLE "RoomTypingResult"
  ADD CONSTRAINT "RoomTypingResult_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "RoomParticipant"("id")
  ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;

ALTER TABLE "RoomTypingResult"
  ADD CONSTRAINT "RoomTypingResult_roomId_fkey"
  FOREIGN KEY ("roomId") REFERENCES "Room"("id")
  ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;

-- Quiz results table
CREATE TABLE IF NOT EXISTS "RoomQuizResult" (
  "id"             TEXT NOT NULL,
  "roomId"         TEXT NOT NULL,
  "participantId"  TEXT NOT NULL,
  "correctAnswers" INTEGER NOT NULL,
  "wrongAnswers"   INTEGER NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "score"          FLOAT8 NOT NULL,
  "timeTakenSec"   INTEGER NOT NULL,
  "answers"        JSONB NOT NULL DEFAULT '{}',
  "completedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "RoomQuizResult_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RoomQuizResult_participantId_key" ON "RoomQuizResult"("participantId");
CREATE INDEX IF NOT EXISTS "RoomQuizResult_roomId_idx" ON "RoomQuizResult"("roomId");

ALTER TABLE "RoomQuizResult"
  ADD CONSTRAINT "RoomQuizResult_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "RoomParticipant"("id")
  ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;

ALTER TABLE "RoomQuizResult"
  ADD CONSTRAINT "RoomQuizResult_roomId_fkey"
  FOREIGN KEY ("roomId") REFERENCES "Room"("id")
  ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;

-- Final results / leaderboard table
CREATE TABLE IF NOT EXISTS "RoomFinalResult" (
  "id"            TEXT NOT NULL,
  "roomId"        TEXT NOT NULL,
  "participantId" TEXT NOT NULL,
  "typingScore"   FLOAT8 NOT NULL,
  "quizScore"     FLOAT8 NOT NULL,
  "finalScore"    FLOAT8 NOT NULL,
  "rank"          INTEGER,
  "completedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "RoomFinalResult_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RoomFinalResult_participantId_key"      ON "RoomFinalResult"("participantId");
CREATE INDEX IF NOT EXISTS "RoomFinalResult_roomId_finalScore_idx" ON "RoomFinalResult"("roomId", "finalScore");

ALTER TABLE "RoomFinalResult"
  ADD CONSTRAINT "RoomFinalResult_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "RoomParticipant"("id")
  ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;

ALTER TABLE "RoomFinalResult"
  ADD CONSTRAINT "RoomFinalResult_roomId_fkey"
  FOREIGN KEY ("roomId") REFERENCES "Room"("id")
  ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;

-- Quiz question bank
CREATE TABLE IF NOT EXISTS "RoomQuizQuestion" (
  "id"            TEXT NOT NULL,
  "question"      TEXT NOT NULL,
  "optionA"       TEXT NOT NULL,
  "optionB"       TEXT NOT NULL,
  "optionC"       TEXT NOT NULL,
  "optionD"       TEXT NOT NULL,
  "correctOption" TEXT NOT NULL,
  "category"      TEXT NOT NULL DEFAULT 'General',
  "difficulty"    TEXT NOT NULL DEFAULT 'medium',
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "RoomQuizQuestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "RoomQuizQuestion_category_idx" ON "RoomQuizQuestion"("category");

-- Enable Realtime on these tables (for live dashboard & waiting room)
ALTER PUBLICATION supabase_realtime ADD TABLE "Room";
ALTER PUBLICATION supabase_realtime ADD TABLE "RoomParticipant";
ALTER PUBLICATION supabase_realtime ADD TABLE "RoomFinalResult";
