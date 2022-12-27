/*
  Warnings:

  - You are about to drop the column `companyid` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `immobileid` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `personid` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `publicplace` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `companyid` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `datedue` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `personid` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `clientcode` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `personid` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `immobile` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `immobile` table. All the data in the column will be lost.
  - You are about to drop the column `datedue` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `projectid` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `creanumber` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `credentialcode` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `personid` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `budgetid` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `companyid` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `datedue` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `personid` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `datedue` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `professionalid` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `projectid` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `companyid` on the `telephone` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `telephone` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `telephone` table. All the data in the column will be lost.
  - You are about to drop the column `personid` on the `telephone` table. All the data in the column will be lost.
  - You are about to drop the column `dateinsert` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `dateupdate` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `personid` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `budgetpayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `budgetservice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `immobileowner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logintoken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serviceimmobile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicestage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjectmessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `immobile_id` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `immobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_due` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budget_id` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professional_id` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `telephone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `telephone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `telephone` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `number` on the `telephone` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `person_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_companyid_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_immobileid_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_personid_fkey";

-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_companyid_fkey";

-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_personid_fkey";

-- DropForeignKey
ALTER TABLE "budgetpayment" DROP CONSTRAINT "budgetpayment_budgetid_fkey";

-- DropForeignKey
ALTER TABLE "budgetservice" DROP CONSTRAINT "budgetservice_budgetid_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_personid_fkey";

-- DropForeignKey
ALTER TABLE "immobileowner" DROP CONSTRAINT "immobileowner_companyid_fkey";

-- DropForeignKey
ALTER TABLE "immobileowner" DROP CONSTRAINT "immobileowner_immobileid_fkey";

-- DropForeignKey
ALTER TABLE "immobileowner" DROP CONSTRAINT "immobileowner_personid_fkey";

-- DropForeignKey
ALTER TABLE "logintoken" DROP CONSTRAINT "logintoken_userid_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_projectid_fkey";

-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_personid_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_budgetid_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_companyid_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_personid_fkey";

-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_professionalid_fkey";

-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_projectid_fkey";

-- DropForeignKey
ALTER TABLE "serviceimmobile" DROP CONSTRAINT "serviceimmobile_immobileid_fkey";

-- DropForeignKey
ALTER TABLE "serviceimmobile" DROP CONSTRAINT "serviceimmobile_serviceid_fkey";

-- DropForeignKey
ALTER TABLE "servicestage" DROP CONSTRAINT "servicestage_serviceid_fkey";

-- DropForeignKey
ALTER TABLE "servicestage" DROP CONSTRAINT "servicestage_userid_fkey";

-- DropForeignKey
ALTER TABLE "subjectmessage" DROP CONSTRAINT "subjectmessage_userid_fkey";

-- DropForeignKey
ALTER TABLE "telephone" DROP CONSTRAINT "telephone_companyid_fkey";

-- DropForeignKey
ALTER TABLE "telephone" DROP CONSTRAINT "telephone_personid_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_personid_fkey";

-- AlterTable
ALTER TABLE "address" DROP COLUMN "companyid",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "immobileid",
DROP COLUMN "personid",
DROP COLUMN "profession",
DROP COLUMN "publicplace",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "immobile_id" INTEGER NOT NULL,
ADD COLUMN     "person_id" INTEGER NOT NULL,
ADD COLUMN     "public_place" VARCHAR(255),
ALTER COLUMN "cep" DROP NOT NULL,
ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "county" DROP NOT NULL,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "complement" DROP NOT NULL;

-- AlterTable
ALTER TABLE "budget" DROP COLUMN "companyid",
DROP COLUMN "datedue",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "personid",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "date_due" INTEGER,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "person_id" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "company" DROP COLUMN "clientcode",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "personid",
ADD COLUMN     "client_code" INTEGER,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "person_id" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "immobile" DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
ADD COLUMN     "area" INTEGER,
ADD COLUMN     "ccir_number" VARCHAR(255),
ADD COLUMN     "comarca" VARCHAR(255),
ADD COLUMN     "comarca_code" VARCHAR(255),
ADD COLUMN     "county" VARCHAR(255),
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "land" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "perimeter" INTEGER,
ADD COLUMN     "process" VARCHAR(255),
ADD COLUMN     "registration" VARCHAR(255),
ADD COLUMN     "status" VARCHAR(255) DEFAULT 'NORMAL',
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "datedue",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "projectid",
ADD COLUMN     "date_due" INTEGER NOT NULL,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "project_id" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "priority" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "professional" DROP COLUMN "creanumber",
DROP COLUMN "credentialcode",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "personid",
ADD COLUMN     "crea_number" VARCHAR(255),
ADD COLUMN     "credential_code" VARCHAR(255),
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "person_id" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "project" DROP COLUMN "budgetid",
DROP COLUMN "companyid",
DROP COLUMN "datedue",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "personid",
ADD COLUMN     "budget_id" INTEGER NOT NULL,
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "date_due" INTEGER,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "person_id" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "total" DROP NOT NULL,
ALTER COLUMN "priority" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "service" DROP COLUMN "datedue",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "professionalid",
DROP COLUMN "projectid",
ADD COLUMN     "date_due" INTEGER,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "professional_id" INTEGER NOT NULL,
ADD COLUMN     "project_id" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "priority" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "telephone" DROP COLUMN "companyid",
DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "personid",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "person_id" INTEGER NOT NULL,
ADD COLUMN     "type" VARCHAR(255) NOT NULL,
DROP COLUMN "number",
ADD COLUMN     "number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "dateinsert",
DROP COLUMN "dateupdate",
DROP COLUMN "description",
DROP COLUMN "personid",
ADD COLUMN     "date_insert" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_update" INTEGER,
ADD COLUMN     "person_id" INTEGER NOT NULL,
ALTER COLUMN "office" SET DEFAULT 'VISITANTE';

-- DropTable
DROP TABLE "budgetpayment";

-- DropTable
DROP TABLE "budgetservice";

-- DropTable
DROP TABLE "immobileowner";

-- DropTable
DROP TABLE "logintoken";

-- DropTable
DROP TABLE "serviceimmobile";

-- DropTable
DROP TABLE "servicestage";

-- DropTable
DROP TABLE "subjectmessage";

-- CreateTable
CREATE TABLE "immobile_owner" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "person_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "immobile_id" INTEGER NOT NULL,

    CONSTRAINT "immobile_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "description" VARCHAR(255),

    CONSTRAINT "point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immobile_point" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "immobile_id" INTEGER NOT NULL,
    "point_id" INTEGER NOT NULL,

    CONSTRAINT "immobile_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_service" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "budget_id" INTEGER NOT NULL,

    CONSTRAINT "budget_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_payment" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "date_due" INTEGER,
    "budget_id" INTEGER NOT NULL,

    CONSTRAINT "budget_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_immobile" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "type" VARCHAR(255) NOT NULL,
    "service_id" INTEGER NOT NULL,
    "immobile_id" INTEGER NOT NULL,

    CONSTRAINT "service_immobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_stage" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "description" VARCHAR(255),
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "date_due" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "service_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "service_stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_message" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "text" VARCHAR(255) NOT NULL,
    "referenceid" INTEGER,
    "referencebase" VARCHAR(255),
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "subject_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_token" (
    "id" SERIAL NOT NULL,
    "date_insert" INTEGER NOT NULL DEFAULT 0,
    "date_update" INTEGER,
    "token" VARCHAR(255) NOT NULL,
    "isblocked" BOOLEAN NOT NULL DEFAULT false,
    "validation_due" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "login_token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telephone" ADD CONSTRAINT "telephone_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telephone" ADD CONSTRAINT "telephone_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_immobile_id_fkey" FOREIGN KEY ("immobile_id") REFERENCES "immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobile_owner" ADD CONSTRAINT "immobile_owner_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobile_owner" ADD CONSTRAINT "immobile_owner_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobile_owner" ADD CONSTRAINT "immobile_owner_immobile_id_fkey" FOREIGN KEY ("immobile_id") REFERENCES "immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobile_point" ADD CONSTRAINT "immobile_point_immobile_id_fkey" FOREIGN KEY ("immobile_id") REFERENCES "immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobile_point" ADD CONSTRAINT "immobile_point_point_id_fkey" FOREIGN KEY ("point_id") REFERENCES "point"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_service" ADD CONSTRAINT "budget_service_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_payment" ADD CONSTRAINT "budget_payment_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_immobile" ADD CONSTRAINT "service_immobile_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_immobile" ADD CONSTRAINT "service_immobile_immobile_id_fkey" FOREIGN KEY ("immobile_id") REFERENCES "immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_stage" ADD CONSTRAINT "service_stage_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_stage" ADD CONSTRAINT "service_stage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_message" ADD CONSTRAINT "subject_message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_token" ADD CONSTRAINT "login_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
