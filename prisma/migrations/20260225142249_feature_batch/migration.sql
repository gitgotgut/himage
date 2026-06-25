-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "householdId" TEXT,
ADD COLUMN     "monthlySavingsHintCents" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "trialEndDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayCurrency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "householdId" TEXT;

-- CreateTable
CREATE TABLE "SubscriptionHistory" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseholdMember" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HouseholdMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubscriptionHistory_subscriptionId_idx" ON "SubscriptionHistory"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Household_ownerId_key" ON "Household"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "HouseholdMember_userId_key" ON "HouseholdMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HouseholdMember_householdId_userId_key" ON "HouseholdMember"("householdId", "userId");

-- CreateIndex
CREATE INDEX "Subscription_householdId_idx" ON "Subscription"("householdId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Household" ADD CONSTRAINT "Household_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseholdMember" ADD CONSTRAINT "HouseholdMember_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseholdMember" ADD CONSTRAINT "HouseholdMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
