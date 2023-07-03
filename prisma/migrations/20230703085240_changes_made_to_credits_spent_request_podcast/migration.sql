/*
  Warnings:

  - You are about to drop the column `request_id` on the `CreditsSpent` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `Request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[podcast_hash]` on the table `CreditsSpent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Podcast` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[podcast_hash]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[summary_url]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `podcast_hash` to the `CreditsSpent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `podcast_hash` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditsSpent" DROP CONSTRAINT "CreditsSpent_request_id_fkey";

-- DropIndex
DROP INDEX "CreditsSpent_request_id_key";

-- AlterTable
ALTER TABLE "CreditsSpent" DROP COLUMN "request_id",
ADD COLUMN     "podcast_hash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "hash",
ADD COLUMN     "podcast_hash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 20.0;

-- CreateIndex
CREATE UNIQUE INDEX "CreditsSpent_podcast_hash_key" ON "CreditsSpent"("podcast_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_hash_key" ON "Podcast"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Request_podcast_hash_key" ON "Request"("podcast_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Request_summary_url_key" ON "Request"("summary_url");

-- AddForeignKey
ALTER TABLE "CreditsSpent" ADD CONSTRAINT "CreditsSpent_podcast_hash_fkey" FOREIGN KEY ("podcast_hash") REFERENCES "Podcast"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_podcast_hash_fkey" FOREIGN KEY ("podcast_hash") REFERENCES "Podcast"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;
