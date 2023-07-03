-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "podcastName" TEXT NOT NULL,
    "showName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "podcastName" TEXT NOT NULL,
    "showName" TEXT NOT NULL,
    "summary" JSONB NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
