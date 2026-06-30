-- Associate albums with a Circle for OPEN visibility
ALTER TABLE "Album" ADD COLUMN "circleId" TEXT;
CREATE INDEX "Album_circleId_idx" ON "Album"("circleId");
