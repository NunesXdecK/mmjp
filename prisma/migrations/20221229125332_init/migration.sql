/*
  Warnings:

  - You are about to drop the column `total` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "address" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "budget" ALTER COLUMN "date_due" SET DATA TYPE BIGINT,
ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "budget_payment" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT,
ALTER COLUMN "value" SET DATA TYPE BIGINT,
ALTER COLUMN "date_due" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "budget_service" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT,
ALTER COLUMN "value" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "company" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "immobile" ALTER COLUMN "area" SET DATA TYPE BIGINT,
ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT,
ALTER COLUMN "perimeter" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "immobile_owner" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "immobile_point" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "login_token" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT,
ALTER COLUMN "validation_due" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "value" SET DATA TYPE BIGINT,
ALTER COLUMN "date_due" SET DATA TYPE BIGINT,
ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "person" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "point" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "professional" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "project" DROP COLUMN "total",
ALTER COLUMN "date_due" SET DATA TYPE BIGINT,
ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "service" DROP COLUMN "total",
ALTER COLUMN "value" SET DATA TYPE BIGINT,
ALTER COLUMN "date_due" SET DATA TYPE BIGINT,
ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "service_immobile" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "service_stage" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT,
ALTER COLUMN "value" SET DATA TYPE BIGINT,
ALTER COLUMN "date_due" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "subject_message" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "telephone" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "date_insert" SET DATA TYPE BIGINT,
ALTER COLUMN "date_update" SET DATA TYPE BIGINT;
