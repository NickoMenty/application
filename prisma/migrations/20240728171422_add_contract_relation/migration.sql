-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "contractId" TEXT;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "ItemContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
