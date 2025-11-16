-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "result" JSONB;
