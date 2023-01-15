-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_professional_id_fkey";

-- AlterTable
ALTER TABLE "service" ALTER COLUMN "professional_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;
