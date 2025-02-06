-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('MARIAGE', 'ANNIVERSAIRE', 'SOIREE_ETUDIANTE', 'AUTRES');

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "event_type" "EventType" NOT NULL DEFAULT 'AUTRES';
