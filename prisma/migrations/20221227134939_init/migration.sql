/*
  Warnings:

  - You are about to drop the column `dateInsert` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `publicPlace` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `dateDue` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `dateDue` on the `budgetpayment` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `budgetpayment` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `budgetpayment` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `budgetservice` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `budgetservice` table. All the data in the column will be lost.
  - You are about to drop the column `clientCode` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `immobile` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `immobile` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `immobileowner` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `immobileowner` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `logintoken` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `logintoken` table. All the data in the column will be lost.
  - You are about to drop the column `validationDue` on the `logintoken` table. All the data in the column will be lost.
  - You are about to drop the column `dateDue` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `clientCode` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `rgIssuer` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `creaNumber` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `credentialCode` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `dateDue` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `dateDue` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `serviceimmobile` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `serviceimmobile` table. All the data in the column will be lost.
  - You are about to drop the column `dateDue` on the `servicestage` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `servicestage` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `servicestage` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `subjectmessage` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `subjectmessage` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `telephone` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `telephone` table. All the data in the column will be lost.
  - You are about to drop the column `dateInsert` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `dateUpdate` on the `user` table. All the data in the column will be lost.
  - Added the required column `dateinsert` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicplace` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datedue` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datedue` to the `budgetpayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `budgetpayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `budgetpayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `budgetservice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `budgetservice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `immobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `immobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `immobileowner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `immobileowner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `logintoken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `logintoken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validationdue` to the `logintoken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datedue` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creanumber` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credentialcode` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datedue` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datedue` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `serviceimmobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `serviceimmobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datedue` to the `servicestage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `servicestage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `servicestage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `subjectmessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `subjectmessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `telephone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `telephone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateinsert` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateupdate` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
DROP COLUMN "publicPlace",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL,
ADD COLUMN     "publicplace" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "budget" DROP COLUMN "dateDue",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "datedue" INTEGER NOT NULL,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "budgetpayment" DROP COLUMN "dateDue",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "datedue" INTEGER NOT NULL,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "budgetservice" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "company" DROP COLUMN "clientCode",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "clientcode" INTEGER,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER;

-- AlterTable
ALTER TABLE "immobile" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "immobileowner" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "logintoken" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
DROP COLUMN "validationDue",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL,
ADD COLUMN     "validationdue" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "dateDue",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "datedue" INTEGER NOT NULL,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "person" DROP COLUMN "clientCode",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
DROP COLUMN "maritalStatus",
DROP COLUMN "rgIssuer",
ADD COLUMN     "clientcode" INTEGER,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER,
ADD COLUMN     "maritalstatus" VARCHAR(255),
ADD COLUMN     "rgissuer" VARCHAR(255);

-- AlterTable
ALTER TABLE "professional" DROP COLUMN "creaNumber",
DROP COLUMN "credentialCode",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "creanumber" VARCHAR(255) NOT NULL,
ADD COLUMN     "credentialcode" VARCHAR(255) NOT NULL,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "project" DROP COLUMN "dateDue",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "datedue" INTEGER NOT NULL,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "service" DROP COLUMN "dateDue",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "datedue" INTEGER NOT NULL,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "serviceimmobile" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "servicestage" DROP COLUMN "dateDue",
DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "datedue" INTEGER NOT NULL,
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subjectmessage" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "telephone" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "dateInsert",
DROP COLUMN "dateUpdate",
ADD COLUMN     "dateinsert" INTEGER NOT NULL,
ADD COLUMN     "dateupdate" INTEGER NOT NULL;
