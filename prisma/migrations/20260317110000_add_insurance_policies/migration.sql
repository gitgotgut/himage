-- Base insurance tables (InsurancePolicy + InsuranceDocument).
-- Backfills a migration for models previously created via `db push`, so the
-- migration chain is complete on a fresh database. Ordered before the
-- claims/proposals migration which references InsurancePolicy.

CREATE TABLE "InsurancePolicy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'other',
    "premiumCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingCycle" TEXT NOT NULL,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "policyNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "coverageNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InsurancePolicy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InsuranceDocument" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parsedStatus" TEXT NOT NULL DEFAULT 'pending',
    "analysisResult" JSONB,
    CONSTRAINT "InsuranceDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InsurancePolicy_userId_idx" ON "InsurancePolicy"("userId");
CREATE INDEX "InsurancePolicy_householdId_idx" ON "InsurancePolicy"("householdId");
CREATE INDEX "InsuranceDocument_policyId_idx" ON "InsuranceDocument"("policyId");

ALTER TABLE "InsurancePolicy" ADD CONSTRAINT "InsurancePolicy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InsurancePolicy" ADD CONSTRAINT "InsurancePolicy_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InsuranceDocument" ADD CONSTRAINT "InsuranceDocument_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "InsurancePolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
