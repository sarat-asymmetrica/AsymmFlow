/*
  Warnings:

  - You are about to drop the column `created_at` on the `communications` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `communications` table. All the data in the column will be lost.
  - You are about to drop the column `leadId` on the `communications` table. All the data in the column will be lost.
  - You are about to drop the column `quoteId` on the `communications` table. All the data in the column will be lost.
  - You are about to drop the column `rfqId` on the `communications` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `communications` table. All the data in the column will be lost.
  - You are about to drop the column `businessAccountName` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `advanceReceiveDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `advanceReceivedAmount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `amountPaidToSupplier` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `costAtOrder` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `costWithVATAtOrder` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `creditNoteAmount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerPaymentDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryStatus` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `expectedDispatchDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `fileNo` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `gicInvoice` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `offerNo` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phTradingInvoice` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phTradingInvoiceDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phTradingInvoiceNo` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `profitAtOrder` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `profitPercentageAtOrder` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `rfqOpportunityId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPriceToCustomerBHD` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `supplierInvoiceAmount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `supplierInvoiceCurrency` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `supplierInvoiceDueDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `supplierInvoiceNo` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `supplierName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `supplierPaymentDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalProfitAtOrder` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalSaleWithVAT` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `vatAtCost` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `vatAtProfit` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `workingOnFileStatus` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToId` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `certificates` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfOrigin` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `discountBHD` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDelivery` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `followUpNotes` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `lastFollowUpDate` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `nextFollowUpDate` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `profitBHD` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `profitPercentage` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `quotationId` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `quoteDate` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `quoteValidUntil` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `rfqOpportunityId` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalBHD` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `totalBHD` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `vatBHD` on the `quotations` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `quotations` table. All the data in the column will be lost.
  - The `status` column on the `quotations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `costPrice` on the `quote_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `quote_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemNo` on the `quote_items` table. All the data in the column will be lost.
  - You are about to drop the column `profit` on the `quote_items` table. All the data in the column will be lost.
  - You are about to drop the column `profitPercentage` on the `quote_items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `quote_items` table. All the data in the column will be lost.
  - The primary key for the `staff_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `staff_users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `staff_users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `staff_users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `staff_users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `_ProjectStaff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rfq_opportunities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rfq_templates` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cid]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderRef]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quotationId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quoteRef]` on the table `quotations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `direction` to the `communications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `communications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `communications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `communications` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `communications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `businessName` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cid` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opportunityId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderRef` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalValue` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `quotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opportunityId` to the `quotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteRef` to the `quotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `quotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `quotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validUntil` to the `quotations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `quote_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitCost` to the `quote_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `quote_items` table without a default value. This is not possible if the table is not empty.
  - The required column `staffId` was added to the `staff_users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `staff_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_CONFIRMATION', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'FAILED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'DELAYED', 'FAILED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BHD', 'USD', 'EUR', 'GBP', 'AED');

-- CreateEnum
CREATE TYPE "CommunicationType" AS ENUM ('EMAIL', 'CALL', 'NOTE', 'MEETING');

-- CreateEnum
CREATE TYPE "CommunicationDirection" AS ENUM ('INBOUND', 'OUTBOUND', 'INTERNAL');

-- DropForeignKey
ALTER TABLE "_ProjectStaff" DROP CONSTRAINT "_ProjectStaff_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectStaff" DROP CONSTRAINT "_ProjectStaff_B_fkey";

-- DropForeignKey
ALTER TABLE "communications" DROP CONSTRAINT "communications_leadId_fkey";

-- DropForeignKey
ALTER TABLE "communications" DROP CONSTRAINT "communications_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "communications" DROP CONSTRAINT "communications_rfqId_fkey";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_customerId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_rfqOpportunityId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_managerId_fkey";

-- DropForeignKey
ALTER TABLE "quotations" DROP CONSTRAINT "quotations_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "quotations" DROP CONSTRAINT "quotations_customerId_fkey";

-- DropForeignKey
ALTER TABLE "quotations" DROP CONSTRAINT "quotations_rfqOpportunityId_fkey";

-- DropForeignKey
ALTER TABLE "rfq_opportunities" DROP CONSTRAINT "rfq_opportunities_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "rfq_opportunities" DROP CONSTRAINT "rfq_opportunities_customerId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectId_fkey";

-- DropIndex
DROP INDEX "customers_customerId_key";

-- DropIndex
DROP INDEX "orders_orderId_key";

-- DropIndex
DROP INDEX "quotations_quotationId_key";

-- AlterTable
ALTER TABLE "communications" DROP COLUMN "created_at",
DROP COLUMN "date",
DROP COLUMN "leadId",
DROP COLUMN "quoteId",
DROP COLUMN "rfqId",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "direction" "CommunicationDirection" NOT NULL,
ADD COLUMN     "loggedByStaffId" UUID,
ADD COLUMN     "opportunityId" UUID,
ADD COLUMN     "quotationId" UUID,
ADD COLUMN     "recipient" TEXT,
ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "subject" DROP NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "CommunicationType" NOT NULL;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "businessAccountName",
DROP COLUMN "created_at",
DROP COLUMN "customerId",
DROP COLUMN "updated_at",
ADD COLUMN     "businessName" TEXT NOT NULL,
ADD COLUMN     "cid" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "advanceReceiveDate",
DROP COLUMN "advanceReceivedAmount",
DROP COLUMN "amountPaidToSupplier",
DROP COLUMN "assignedToId",
DROP COLUMN "costAtOrder",
DROP COLUMN "costWithVATAtOrder",
DROP COLUMN "created_at",
DROP COLUMN "creditNoteAmount",
DROP COLUMN "customerId",
DROP COLUMN "customerName",
DROP COLUMN "customerPaymentDate",
DROP COLUMN "deliveryStatus",
DROP COLUMN "expectedDispatchDate",
DROP COLUMN "fileNo",
DROP COLUMN "gicInvoice",
DROP COLUMN "instrumentName",
DROP COLUMN "offerNo",
DROP COLUMN "orderId",
DROP COLUMN "phTradingInvoice",
DROP COLUMN "phTradingInvoiceDate",
DROP COLUMN "phTradingInvoiceNo",
DROP COLUMN "profitAtOrder",
DROP COLUMN "profitPercentageAtOrder",
DROP COLUMN "project",
DROP COLUMN "rfqOpportunityId",
DROP COLUMN "sellingPriceToCustomerBHD",
DROP COLUMN "supplierInvoiceAmount",
DROP COLUMN "supplierInvoiceCurrency",
DROP COLUMN "supplierInvoiceDueDate",
DROP COLUMN "supplierInvoiceNo",
DROP COLUMN "supplierName",
DROP COLUMN "supplierPaymentDate",
DROP COLUMN "totalProfitAtOrder",
DROP COLUMN "totalSaleWithVAT",
DROP COLUMN "updated_at",
DROP COLUMN "vatAtCost",
DROP COLUMN "vatAtProfit",
DROP COLUMN "workingOnFileStatus",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" UUID NOT NULL,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BHD',
ADD COLUMN     "expectedDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "opportunityId" UUID NOT NULL,
ADD COLUMN     "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderRef" TEXT NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_CONFIRMATION',
ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" UUID NOT NULL;

-- AlterTable
ALTER TABLE "quotations" DROP COLUMN "assignedToId",
DROP COLUMN "certificates",
DROP COLUMN "countryOfOrigin",
DROP COLUMN "created_at",
DROP COLUMN "customerId",
DROP COLUMN "discountBHD",
DROP COLUMN "estimatedDelivery",
DROP COLUMN "followUpNotes",
DROP COLUMN "lastFollowUpDate",
DROP COLUMN "nextFollowUpDate",
DROP COLUMN "profitBHD",
DROP COLUMN "profitPercentage",
DROP COLUMN "quotationId",
DROP COLUMN "quoteDate",
DROP COLUMN "quoteValidUntil",
DROP COLUMN "rfqOpportunityId",
DROP COLUMN "subtotalBHD",
DROP COLUMN "totalBHD",
DROP COLUMN "updated_at",
DROP COLUMN "vatBHD",
DROP COLUMN "warranty",
ADD COLUMN     "approvedById" UUID,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" UUID NOT NULL,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BHD',
ADD COLUMN     "expectedDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "financeCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "fxGain" DOUBLE PRECISION,
ADD COLUMN     "fxRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "insurancePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "marginApprovalPopup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "markupPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "opportunityId" UUID NOT NULL,
ADD COLUMN     "profitMarginBHD" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quoteRef" TEXT NOT NULL,
ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalWithVAT" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" UUID NOT NULL,
ADD COLUMN     "validUntil" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vatPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "paymentTerms" DROP NOT NULL,
ALTER COLUMN "deliveryTerms" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "quote_items" DROP COLUMN "costPrice",
DROP COLUMN "created_at",
DROP COLUMN "itemNo",
DROP COLUMN "profit",
DROP COLUMN "profitPercentage",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "staff_users" DROP CONSTRAINT "staff_users_pkey",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "role",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "staffId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "staff_users_pkey" PRIMARY KEY ("staffId");

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "created_at",
DROP COLUMN "projectId",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- DropTable
DROP TABLE "_ProjectStaff";

-- DropTable
DROP TABLE "leads";

-- DropTable
DROP TABLE "projects";

-- DropTable
DROP TABLE "rfq_opportunities";

-- DropTable
DROP TABLE "rfq_templates";

-- DropEnum
DROP TYPE "LeadStatus";

-- DropEnum
DROP TYPE "ProjectStatus";

-- DropEnum
DROP TYPE "StaffRole";

-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL,
    "oppRef" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
    "value" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BHD',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "poRef" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BHD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" UUID NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "shipmentRef" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "shippedOn" TIMESTAMP(3),
    "expectedDeliveryDate" TIMESTAMP(3),
    "actualShipmentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "orderId" UUID NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "paymentRef" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BHD',
    "paymentMethod" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentReceivedOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "shipmentId" UUID,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opportunityId" UUID,
    "quotationId" UUID,
    "orderId" UUID,
    "purchaseOrderId" UUID,
    "shipmentId" UUID,
    "paymentId" UUID,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_oppRef_key" ON "opportunities"("oppRef");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_poRef_key" ON "purchase_orders"("poRef");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderId_key" ON "purchase_orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_shipmentRef_key" ON "shipments"("shipmentRef");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentRef_key" ON "payments"("paymentRef");

-- CreateIndex
CREATE UNIQUE INDEX "customers_cid_key" ON "customers"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderRef_key" ON "orders"("orderRef");

-- CreateIndex
CREATE UNIQUE INDEX "orders_quotationId_key" ON "orders"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_quoteRef_key" ON "quotations"("quoteRef");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "staff_users"("staffId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "staff_users"("staffId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "staff_users"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_loggedByStaffId_fkey" FOREIGN KEY ("loggedByStaffId") REFERENCES "staff_users"("staffId") ON DELETE SET NULL ON UPDATE CASCADE;
