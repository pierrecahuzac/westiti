-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_userId_fkey";

-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_eventId_fkey";

-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_userId_fkey";

-- DropForeignKey
ALTER TABLE "userevent" DROP CONSTRAINT "userevent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "userevent" DROP CONSTRAINT "userevent_userId_fkey";

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userevent" ADD CONSTRAINT "userevent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userevent" ADD CONSTRAINT "userevent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
