-- CreateTable
CREATE TABLE "BankTranscript" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parsedStatus" TEXT NOT NULL DEFAULT 'pending',
    "candidates" JSONB,

    CONSTRAINT "BankTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankTranscript_userId_idx" ON "BankTranscript"("userId");

-- AddForeignKey
ALTER TABLE "BankTranscript" ADD CONSTRAINT "BankTranscript_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
