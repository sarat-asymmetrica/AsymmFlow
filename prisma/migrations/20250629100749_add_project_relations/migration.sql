-- CreateTable
CREATE TABLE "_ProjectsAsMember" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProjectsAsMember_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectsAsMember_B_index" ON "_ProjectsAsMember"("B");

-- AddForeignKey
ALTER TABLE "_ProjectsAsMember" ADD CONSTRAINT "_ProjectsAsMember_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectsAsMember" ADD CONSTRAINT "_ProjectsAsMember_B_fkey" FOREIGN KEY ("B") REFERENCES "staff_users"("staffId") ON DELETE CASCADE ON UPDATE CASCADE;
