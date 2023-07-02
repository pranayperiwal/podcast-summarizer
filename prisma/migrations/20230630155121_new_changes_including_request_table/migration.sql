/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `podcastId` on the `CreditsSpent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CreditsSpent` table. All the data in the column will be lost.
  - You are about to drop the column `episodeName` on the `Podcast` table. All the data in the column will be lost.
  - You are about to drop the column `showName` on the `Podcast` table. All the data in the column will be lost.
  - You are about to drop the column `podcastName` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `showName` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `podcastName` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `showName` on the `Summary` table. All the data in the column will be lost.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `paymentMethod` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[request_id]` on the table `CreditsSpent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_account_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_id` to the `CreditsSpent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `CreditsSpent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `episode_name` to the `Podcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_name` to the `Podcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `podcast_name` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_name` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `podcast_name` to the `Summary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_name` to the `Summary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_date` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "CreditsSpent" DROP CONSTRAINT "CreditsSpent_userId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "Account_provider_providerAccountId_key";

-- DropIndex
DROP INDEX "Session_sessionToken_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "providerAccountId",
DROP COLUMN "userId",
ADD COLUMN     "provider_account_id" TEXT NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "CreditsSpent" DROP COLUMN "podcastId",
DROP COLUMN "userId",
ADD COLUMN     "request_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Podcast" DROP COLUMN "episodeName",
DROP COLUMN "showName",
ADD COLUMN     "episode_name" TEXT NOT NULL,
ADD COLUMN     "show_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "podcastName",
DROP COLUMN "showName",
DROP COLUMN "userId",
ADD COLUMN     "podcast_name" TEXT NOT NULL,
ADD COLUMN     "show_name" TEXT NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "sessionToken",
DROP COLUMN "userId",
ADD COLUMN     "session_token" TEXT NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "podcastName",
DROP COLUMN "showName",
ADD COLUMN     "podcast_name" TEXT NOT NULL,
ADD COLUMN     "show_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "paymentMethod",
DROP COLUMN "transactionDate",
DROP COLUMN "transactionId",
DROP COLUMN "userId",
ADD COLUMN     "payment_method" TEXT NOT NULL,
ADD COLUMN     "transaction_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "transaction_id" SERIAL NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "userId",
ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "Account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "CreditsSpent_request_id_key" ON "CreditsSpent"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditsSpent" ADD CONSTRAINT "CreditsSpent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditsSpent" ADD CONSTRAINT "CreditsSpent_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
