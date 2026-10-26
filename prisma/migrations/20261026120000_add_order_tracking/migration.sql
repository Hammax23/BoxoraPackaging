-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN     "carrier" TEXT,
ADD COLUMN     "estimatedDelivery" TIMESTAMP(3),
ADD COLUMN     "orderStage" TEXT,
ADD COLUMN     "trackingNumber" TEXT,
ADD COLUMN     "trackingUrl" TEXT;

-- CreateTable
CREATE TABLE "OrderUpdate" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderUpdate_quoteId_createdAt_idx" ON "OrderUpdate"("quoteId", "createdAt");

-- AddForeignKey
ALTER TABLE "OrderUpdate" ADD CONSTRAINT "OrderUpdate_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
