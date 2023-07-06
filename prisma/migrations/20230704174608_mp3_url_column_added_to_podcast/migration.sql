/*
  Warnings:

  - A unique constraint covering the columns `[mp3_url]` on the table `Podcast` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Podcast" ADD COLUMN     "mp3_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_mp3_url_key" ON "Podcast"("mp3_url");
