-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gmailAccessToken" TEXT,
ADD COLUMN     "gmailRefreshToken" TEXT,
ADD COLUMN     "gmailTokenExpiry" TIMESTAMP(3);
