/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BudgetPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BudgetService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Immobile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImmobileOwner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Professional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceImmobile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceStage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Telephone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_immobileId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_personId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_personId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetPayment" DROP CONSTRAINT "BudgetPayment_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetService" DROP CONSTRAINT "BudgetService_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_personId_fkey";

-- DropForeignKey
ALTER TABLE "ImmobileOwner" DROP CONSTRAINT "ImmobileOwner_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ImmobileOwner" DROP CONSTRAINT "ImmobileOwner_immobileId_fkey";

-- DropForeignKey
ALTER TABLE "ImmobileOwner" DROP CONSTRAINT "ImmobileOwner_personId_fkey";

-- DropForeignKey
ALTER TABLE "LoginToken" DROP CONSTRAINT "LoginToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_personId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_personId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceImmobile" DROP CONSTRAINT "ServiceImmobile_immobileId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceImmobile" DROP CONSTRAINT "ServiceImmobile_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceStage" DROP CONSTRAINT "ServiceStage_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceStage" DROP CONSTRAINT "ServiceStage_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectMessage" DROP CONSTRAINT "SubjectMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Telephone" DROP CONSTRAINT "Telephone_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Telephone" DROP CONSTRAINT "Telephone_personId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_personId_fkey";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Budget";

-- DropTable
DROP TABLE "BudgetPayment";

-- DropTable
DROP TABLE "BudgetService";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Immobile";

-- DropTable
DROP TABLE "ImmobileOwner";

-- DropTable
DROP TABLE "LoginToken";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "Professional";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "ServiceImmobile";

-- DropTable
DROP TABLE "ServiceStage";

-- DropTable
DROP TABLE "SubjectMessage";

-- DropTable
DROP TABLE "Telephone";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER,
    "description" VARCHAR(255),
    "cpf" VARCHAR(255) NOT NULL,
    "rg" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "rgIssuer" VARCHAR(255),
    "profession" VARCHAR(255),
    "nationality" VARCHAR(255),
    "naturalness" VARCHAR(255),
    "maritalStatus" VARCHAR(255),
    "clientCode" INTEGER,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER,
    "description" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "clientCode" INTEGER,
    "personid" INTEGER NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "creaNumber" VARCHAR(255) NOT NULL,
    "credentialCode" VARCHAR(255) NOT NULL,
    "personid" INTEGER NOT NULL,

    CONSTRAINT "professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telephone" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "personid" INTEGER NOT NULL,
    "companyid" INTEGER NOT NULL,

    CONSTRAINT "telephone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "cep" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "county" VARCHAR(255) NOT NULL,
    "district" VARCHAR(255) NOT NULL,
    "complement" VARCHAR(255) NOT NULL,
    "publicPlace" VARCHAR(255) NOT NULL,
    "profession" VARCHAR(255) NOT NULL,
    "personid" INTEGER NOT NULL,
    "companyid" INTEGER NOT NULL,
    "immobileid" INTEGER NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immobile" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "immobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immobileowner" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "personid" INTEGER NOT NULL,
    "companyid" INTEGER NOT NULL,
    "immobileid" INTEGER NOT NULL,

    CONSTRAINT "immobileowner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "personid" INTEGER NOT NULL,
    "companyid" INTEGER NOT NULL,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgetservice" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "budgetid" INTEGER NOT NULL,

    CONSTRAINT "budgetservice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgetpayment" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "budgetid" INTEGER NOT NULL,

    CONSTRAINT "budgetpayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "budgetid" INTEGER NOT NULL,
    "personid" INTEGER NOT NULL,
    "companyid" INTEGER NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "projectid" INTEGER NOT NULL,
    "professionalid" INTEGER NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serviceimmobile" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "serviceid" INTEGER NOT NULL,
    "immobileid" INTEGER NOT NULL,

    CONSTRAINT "serviceimmobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicestage" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "serviceid" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "servicestage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "projectid" INTEGER NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "office" VARCHAR(255) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "personid" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectmessage" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "referenceid" INTEGER NOT NULL,
    "referenceBase" VARCHAR(255) NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "subjectmessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logintoken" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "validationDue" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "logintoken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_cpf_key" ON "person"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telephone" ADD CONSTRAINT "telephone_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telephone" ADD CONSTRAINT "telephone_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_immobileid_fkey" FOREIGN KEY ("immobileid") REFERENCES "immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobileowner" ADD CONSTRAINT "immobileowner_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobileowner" ADD CONSTRAINT "immobileowner_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobileowner" ADD CONSTRAINT "immobileowner_immobileid_fkey" FOREIGN KEY ("immobileid") REFERENCES "immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgetservice" ADD CONSTRAINT "budgetservice_budgetid_fkey" FOREIGN KEY ("budgetid") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgetpayment" ADD CONSTRAINT "budgetpayment_budgetid_fkey" FOREIGN KEY ("budgetid") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_budgetid_fkey" FOREIGN KEY ("budgetid") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_professionalid_fkey" FOREIGN KEY ("professionalid") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceimmobile" ADD CONSTRAINT "serviceimmobile_serviceid_fkey" FOREIGN KEY ("serviceid") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceimmobile" ADD CONSTRAINT "serviceimmobile_immobileid_fkey" FOREIGN KEY ("immobileid") REFERENCES "immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicestage" ADD CONSTRAINT "servicestage_serviceid_fkey" FOREIGN KEY ("serviceid") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicestage" ADD CONSTRAINT "servicestage_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_personid_fkey" FOREIGN KEY ("personid") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectmessage" ADD CONSTRAINT "subjectmessage_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logintoken" ADD CONSTRAINT "logintoken_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
