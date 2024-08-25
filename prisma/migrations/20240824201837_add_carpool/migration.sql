/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "carpoolId" TEXT NOT NULL,
    CONSTRAINT "Participant_carpoolId_fkey" FOREIGN KEY ("carpoolId") REFERENCES "CarPool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "carPoolId" TEXT NOT NULL,
    CONSTRAINT "Car_carPoolId_fkey" FOREIGN KEY ("carPoolId") REFERENCES "CarPool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CarParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seat" INTEGER NOT NULL,
    "carId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    CONSTRAINT "CarParticipant_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CarParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CarPool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "organiserId" TEXT NOT NULL,
    CONSTRAINT "CarPool_organiserId_fkey" FOREIGN KEY ("organiserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
