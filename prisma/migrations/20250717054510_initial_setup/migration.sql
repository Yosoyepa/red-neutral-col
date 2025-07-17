-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "isp" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "downloadSpeed" DOUBLE PRECISION NOT NULL,
    "uploadSpeed" DOUBLE PRECISION NOT NULL,
    "ping" INTEGER NOT NULL,
    "jitter" DOUBLE PRECISION NOT NULL,
    "throttlingRatio" DOUBLE PRECISION,
    "testDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);
