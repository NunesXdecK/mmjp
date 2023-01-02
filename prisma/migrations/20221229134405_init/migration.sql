/*
  Warnings:

  - The `date_insert` column on the `address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_due` column on the `budget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `budget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `budget_payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_due` column on the `budget_payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `budget_service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `immobile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `immobile_owner` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `immobile_point` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `login_token` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `validation_due` column on the `login_token` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_due` column on the `payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `person` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `point` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `professional` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_due` column on the `project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_due` column on the `service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `service_immobile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `service_stage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_due` column on the `service_stage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `subject_message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `telephone` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_insert` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `date_update` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `budget_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `budget_service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `immobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `immobile_owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `immobile_point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `login_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `service_immobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `service_stage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `subject_message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `telephone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_update` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "budget" DROP COLUMN "date_due",
ADD COLUMN     "date_due" TIMESTAMPTZ(3),
DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "budget_payment" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "value" SET DATA TYPE TEXT,
DROP COLUMN "date_due",
ADD COLUMN     "date_due" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "budget_service" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "value" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "company" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "immobile" ALTER COLUMN "area" SET DATA TYPE VARCHAR(255),
DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "perimeter" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "immobile_owner" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "immobile_point" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "login_token" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL,
DROP COLUMN "validation_due",
ADD COLUMN     "validation_due" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "value" SET DATA TYPE VARCHAR(255),
DROP COLUMN "date_due",
ADD COLUMN     "date_due" TIMESTAMPTZ(3),
DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "person" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "point" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "professional" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "project" DROP COLUMN "date_due",
ADD COLUMN     "date_due" TIMESTAMPTZ(3),
DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "service" ALTER COLUMN "value" SET DATA TYPE VARCHAR(255),
DROP COLUMN "date_due",
ADD COLUMN     "date_due" TIMESTAMPTZ(3),
DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "service_immobile" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "service_stage" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "value" SET DATA TYPE VARCHAR(255),
DROP COLUMN "date_due",
ADD COLUMN     "date_due" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "subject_message" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "telephone" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "date_insert",
ADD COLUMN     "date_insert" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date_update",
ADD COLUMN     "date_update" TIMESTAMPTZ(3) NOT NULL;
