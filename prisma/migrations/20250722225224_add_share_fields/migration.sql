/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `TestResult` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareId" TEXT,
ADD COLUMN     "sharedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "TestResult_shareId_key" ON "TestResult"("shareId");
