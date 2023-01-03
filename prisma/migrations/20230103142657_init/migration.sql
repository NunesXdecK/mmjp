/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `login_token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "login_token_token_key" ON "login_token"("token");
