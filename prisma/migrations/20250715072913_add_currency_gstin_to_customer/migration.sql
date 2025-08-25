-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BHD',
ADD COLUMN     "gstin" TEXT;
