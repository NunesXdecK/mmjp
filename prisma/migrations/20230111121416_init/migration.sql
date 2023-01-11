/*
  Warnings:

  - You are about to drop the column `index` on the `budget_payment` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `budget_service` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "budget_payment_budget_id_index_key";

-- DropIndex
DROP INDEX "budget_service_budget_id_index_key";

-- AlterTable
ALTER TABLE "budget_payment" DROP COLUMN "index";

-- AlterTable
ALTER TABLE "budget_service" DROP COLUMN "index";
