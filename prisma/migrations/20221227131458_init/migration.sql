-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(255) NOT NULL,
    "rg" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "rgIssuer" VARCHAR(255) NOT NULL,
    "profession" VARCHAR(255) NOT NULL,
    "nationality" VARCHAR(255) NOT NULL,
    "naturalness" VARCHAR(255) NOT NULL,
    "maritalStatus" VARCHAR(255) NOT NULL,
    "clientCode" INTEGER NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "clientCode" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "creaNumber" VARCHAR(255) NOT NULL,
    "credentialCode" VARCHAR(255) NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telephone" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "personId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Telephone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
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
    "personId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "immobileId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Immobile" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Immobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImmobileOwner" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "immobileId" INTEGER NOT NULL,

    CONSTRAINT "ImmobileOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetService" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "budgetId" INTEGER NOT NULL,

    CONSTRAINT "BudgetService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetPayment" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "dateDue" INTEGER NOT NULL,
    "budgetId" INTEGER NOT NULL,

    CONSTRAINT "BudgetPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
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
    "budgetId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
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
    "projectId" INTEGER NOT NULL,
    "professionalId" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceImmobile" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "immobileId" INTEGER NOT NULL,

    CONSTRAINT "ServiceImmobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceStage" (
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
    "serviceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ServiceStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
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
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "office" VARCHAR(255) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectMessage" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "referenceId" INTEGER NOT NULL,
    "referenceBase" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SubjectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginToken" (
    "id" SERIAL NOT NULL,
    "dateInsert" INTEGER NOT NULL,
    "dateUpdate" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "validationDue" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoginToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_cpf_key" ON "Person"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telephone" ADD CONSTRAINT "Telephone_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telephone" ADD CONSTRAINT "Telephone_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_immobileId_fkey" FOREIGN KEY ("immobileId") REFERENCES "Immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmobileOwner" ADD CONSTRAINT "ImmobileOwner_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmobileOwner" ADD CONSTRAINT "ImmobileOwner_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmobileOwner" ADD CONSTRAINT "ImmobileOwner_immobileId_fkey" FOREIGN KEY ("immobileId") REFERENCES "Immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetService" ADD CONSTRAINT "BudgetService_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPayment" ADD CONSTRAINT "BudgetPayment_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceImmobile" ADD CONSTRAINT "ServiceImmobile_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceImmobile" ADD CONSTRAINT "ServiceImmobile_immobileId_fkey" FOREIGN KEY ("immobileId") REFERENCES "Immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceStage" ADD CONSTRAINT "ServiceStage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceStage" ADD CONSTRAINT "ServiceStage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectMessage" ADD CONSTRAINT "SubjectMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginToken" ADD CONSTRAINT "LoginToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
