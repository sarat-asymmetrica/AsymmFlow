-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('Admin', 'Sales', 'Operations', 'Management', 'Architect', 'Analyst', 'User');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Qualified', 'Unqualified', 'ConvertedToRFQ', 'Rejected');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'InProgress', 'Completed', 'Canceled');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Planned', 'InProgress', 'Completed', 'OnHold', 'Cancelled');

-- CreateTable
CREATE TABLE "staff_users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "contactNumber" TEXT,
    "role" "StaffRole",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "customerId" TEXT NOT NULL,
    "businessAccountName" TEXT NOT NULL,
    "customerType" TEXT NOT NULL,
    "salutation" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "leadId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL,
    "initialNotes" TEXT,
    "lastContactDate" TIMESTAMP(3),
    "nextFollowUpDate" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "customerId" UUID,
    "assignedToId" UUID,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_opportunities" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "oppNo" TEXT NOT NULL,
    "folderNo" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "sfdcOpportunityTitle" TEXT NOT NULL,
    "endUser" TEXT NOT NULL,
    "latestComment" TEXT,
    "ehReferenceNo" TEXT NOT NULL,
    "valueInBHD" DOUBLE PRECISION NOT NULL,
    "profitPercentage" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "reasonForLoss" TEXT,
    "quoteDate" TIMESTAMP(3) NOT NULL,
    "orderDate" TIMESTAMP(3),
    "approxDeliveryDate" TIMESTAMP(3),
    "paymentTerms" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "rfqReference" TEXT NOT NULL,
    "preparedBy" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "principleName" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "specificationOrderCode" TEXT NOT NULL,
    "oneDriveFolderUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "customerId" UUID NOT NULL,
    "assignedToId" UUID,

    CONSTRAINT "rfq_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" UUID NOT NULL,
    "itemNo" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "costPrice" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "profitPercentage" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "quotationId" UUID NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" UUID NOT NULL,
    "quotationId" TEXT NOT NULL,
    "quoteDate" TIMESTAMP(3) NOT NULL,
    "quoteValidUntil" TIMESTAMP(3) NOT NULL,
    "subtotalBHD" DOUBLE PRECISION NOT NULL,
    "discountBHD" DOUBLE PRECISION NOT NULL,
    "vatBHD" DOUBLE PRECISION NOT NULL,
    "totalBHD" DOUBLE PRECISION NOT NULL,
    "profitBHD" DOUBLE PRECISION NOT NULL,
    "profitPercentage" DOUBLE PRECISION NOT NULL,
    "paymentTerms" TEXT NOT NULL,
    "deliveryTerms" TEXT NOT NULL,
    "estimatedDelivery" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "countryOfOrigin" TEXT NOT NULL,
    "certificates" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastFollowUpDate" TIMESTAMP(3),
    "nextFollowUpDate" TIMESTAMP(3),
    "followUpNotes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rfqOpportunityId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "assignedToId" UUID,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "orderId" TEXT NOT NULL,
    "supplierInvoiceNo" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "supplierInvoiceAmount" DOUBLE PRECISION NOT NULL,
    "supplierInvoiceCurrency" TEXT NOT NULL,
    "supplierInvoiceDueDate" TIMESTAMP(3) NOT NULL,
    "amountPaidToSupplier" DOUBLE PRECISION NOT NULL,
    "supplierPaymentDate" TIMESTAMP(3),
    "fileNo" TEXT,
    "offerNo" TEXT,
    "phTradingInvoiceNo" TEXT,
    "phTradingInvoiceDate" TIMESTAMP(3),
    "sellingPriceToCustomerBHD" DOUBLE PRECISION,
    "customerPaymentDate" TIMESTAMP(3),
    "expectedDispatchDate" TIMESTAMP(3),
    "deliveryStatus" TEXT NOT NULL,
    "advanceReceivedAmount" DOUBLE PRECISION,
    "advanceReceiveDate" TIMESTAMP(3),
    "creditNoteAmount" DOUBLE PRECISION,
    "project" TEXT,
    "customerName" TEXT NOT NULL,
    "gicInvoice" TEXT,
    "phTradingInvoice" TEXT,
    "totalSaleWithVAT" DOUBLE PRECISION,
    "costAtOrder" DOUBLE PRECISION,
    "vatAtCost" DOUBLE PRECISION,
    "costWithVATAtOrder" DOUBLE PRECISION,
    "profitAtOrder" DOUBLE PRECISION,
    "vatAtProfit" DOUBLE PRECISION,
    "totalProfitAtOrder" DOUBLE PRECISION,
    "profitPercentageAtOrder" DOUBLE PRECISION,
    "workingOnFileStatus" TEXT,
    "instrumentName" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rfqOpportunityId" UUID NOT NULL,
    "quotationId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "assignedToId" UUID,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "assignedUserId" UUID,
    "projectId" UUID,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "managerId" UUID NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_templates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfq_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "customerId" UUID,
    "leadId" UUID,
    "rfqId" UUID,
    "quoteId" UUID,
    "orderId" UUID,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectStaff" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProjectStaff_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_email_key" ON "staff_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customerId_key" ON "customers"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "leads_leadId_key" ON "leads"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_opportunities_oppNo_key" ON "rfq_opportunities"("oppNo");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_quotationId_key" ON "quotations"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_templates_name_key" ON "rfq_templates"("name");

-- CreateIndex
CREATE INDEX "_ProjectStaff_B_index" ON "_ProjectStaff"("B");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_opportunities" ADD CONSTRAINT "rfq_opportunities_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_opportunities" ADD CONSTRAINT "rfq_opportunities_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_rfqOpportunityId_fkey" FOREIGN KEY ("rfqOpportunityId") REFERENCES "rfq_opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_rfqOpportunityId_fkey" FOREIGN KEY ("rfqOpportunityId") REFERENCES "rfq_opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "staff_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfq_opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStaff" ADD CONSTRAINT "_ProjectStaff_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectStaff" ADD CONSTRAINT "_ProjectStaff_B_fkey" FOREIGN KEY ("B") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
