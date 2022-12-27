/*
  Warnings:

  - You are about to drop the column `isBlocked` on the `logintoken` table. All the data in the column will be lost.
  - You are about to drop the column `clientcode` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `maritalstatus` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `rgissuer` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `referenceBase` on the `subjectmessage` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `user` table. All the data in the column will be lost.
  - Added the required column `referencebase` to the `subjectmessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logintoken" DROP COLUMN "isBlocked",
ADD COLUMN     "isblocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "person" DROP COLUMN "clientcode",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "maritalstatus",
DROP COLUMN "rgissuer",
ADD COLUMN     "client_code" INTEGER,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "marital_status" VARCHAR(255),
ADD COLUMN     "rg_issuer" VARCHAR(255);

-- AlterTable
ALTER TABLE "subjectmessage" DROP COLUMN "referenceBase",
ADD COLUMN     "referencebase" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isBlocked",
ADD COLUMN     "isblocked" BOOLEAN NOT NULL DEFAULT false;
