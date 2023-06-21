-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "token" DOUBLE PRECISION NOT NULL,
    "numberOfSummaries" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" SERIAL NOT NULL,
    "showName" TEXT NOT NULL,
    "episodeName" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PodcastToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PodcastToUser_AB_unique" ON "_PodcastToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PodcastToUser_B_index" ON "_PodcastToUser"("B");

-- AddForeignKey
ALTER TABLE "_PodcastToUser" ADD CONSTRAINT "_PodcastToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PodcastToUser" ADD CONSTRAINT "_PodcastToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
