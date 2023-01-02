/*
  Warnings:

  - You are about to drop the column `isblocked` on the `login_token` table. All the data in the column will be lost.
  - You are about to drop the column `referencebase` on the `subject_message` table. All the data in the column will be lost.
  - You are about to drop the column `referenceid` on the `subject_message` table. All the data in the column will be lost.
  - You are about to drop the column `isblocked` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_company_id_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_immobile_id_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_person_id_fkey";

-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_company_id_fkey";

-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_person_id_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_person_id_fkey";

-- DropForeignKey
ALTER TABLE "immobile_owner" DROP CONSTRAINT "immobile_owner_company_id_fkey";

-- DropForeignKey
ALTER TABLE "immobile_owner" DROP CONSTRAINT "immobile_owner_person_id_fkey";

-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_person_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_company_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_person_id_fkey";

-- DropForeignKey
ALTER TABLE "telephone" DROP CONSTRAINT "telephone_company_id_fkey";

-- DropForeignKey
ALTER TABLE "telephone" DROP CONSTRAINT "telephone_person_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_person_id_fkey";

-- AlterTable
ALTER TABLE "address" ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "immobile_id" DROP NOT NULL,
ALTER COLUMN "person_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "budget" ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "person_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "company" ALTER COLUMN "person_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "immobile_owner" ALTER COLUMN "person_id" DROP NOT NULL,
ALTER COLUMN "company_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "login_token" DROP COLUMN "isblocked",
ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "professional" ALTER COLUMN "person_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "project" ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "person_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subject_message" DROP COLUMN "referencebase",
DROP COLUMN "referenceid",
ADD COLUMN     "reference_base" VARCHAR(255),
ADD COLUMN     "reference_id" INTEGER;

-- AlterTable
ALTER TABLE "telephone" ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "person_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isblocked",
ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "person_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telephone" ADD CONSTRAINT "telephone_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telephone" ADD CONSTRAINT "telephone_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_immobile_id_fkey" FOREIGN KEY ("immobile_id") REFERENCES "immobile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobile_owner" ADD CONSTRAINT "immobile_owner_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobile_owner" ADD CONSTRAINT "immobile_owner_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
