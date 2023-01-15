/*
  Warnings:

  - You are about to alter the column `value` on the `budget_payment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `value` on the `budget_service` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `index` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `service_stage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "budget_payment" ALTER COLUMN "value" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "budget_service" ALTER COLUMN "value" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "index";

-- AlterTable
ALTER TABLE "service" DROP COLUMN "index";

-- AlterTable
ALTER TABLE "service_stage" DROP COLUMN "index";
