-- CreateTable
CREATE TABLE "InsuranceClaim" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "claimDate" TIMESTAMP(3) NOT NULL,
    "amountCents" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "referenceNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceProposal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'other',
    "quotedPremiumCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingCycle" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InsuranceClaim_policyId_idx" ON "InsuranceClaim"("policyId");

-- CreateIndex
CREATE INDEX "InsuranceClaim_userId_idx" ON "InsuranceClaim"("userId");

-- CreateIndex
CREATE INDEX "InsuranceProposal_userId_idx" ON "InsuranceProposal"("userId");

-- AddForeignKey
ALTER TABLE "InsuranceClaim" ADD CONSTRAINT "InsuranceClaim_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "InsurancePolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceClaim" ADD CONSTRAINT "InsuranceClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceProposal" ADD CONSTRAINT "InsuranceProposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
