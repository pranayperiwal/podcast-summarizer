/*
  Warnings:

  - Made the column `tokenCount` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "tokenCount" SET NOT NULL,
ALTER COLUMN "tokenCount" SET DEFAULT 2.0;
