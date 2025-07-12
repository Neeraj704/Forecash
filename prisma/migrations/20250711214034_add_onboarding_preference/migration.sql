-- CreateTable
CREATE TABLE "OnboardingPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "initialBalance" DOUBLE PRECISION,
    "dailyLimit" DOUBLE PRECISION,
    "fimcpPhone" TEXT,
    "features" TEXT[],
    "linkAccounts" BOOLEAN NOT NULL,
    "setGoalNow" BOOLEAN NOT NULL,
    "assistantMode" TEXT NOT NULL,
    "assistantTone" TEXT NOT NULL,
    "enable2FA" BOOLEAN NOT NULL,
    "accessibility" TEXT[],
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingPreference_userId_key" ON "OnboardingPreference"("userId");

-- AddForeignKey
ALTER TABLE "OnboardingPreference" ADD CONSTRAINT "OnboardingPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
