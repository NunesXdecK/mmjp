/*
  Warnings:

  - A unique constraint covering the columns `[budget_id,index]` on the table `budget_payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[budget_id,index]` on the table `budget_service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "budget_payment_budget_id_index_key" ON "budget_payment"("budget_id", "index");

-- CreateIndex
CREATE UNIQUE INDEX "budget_service_budget_id_index_key" ON "budget_service"("budget_id", "index");
