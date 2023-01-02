/*
  Warnings:

  - You are about to drop the column `number` on the `telephone` table. All the data in the column will be lost.
  - Added the required column `value` to the `telephone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "telephone" DROP COLUMN "number",
ADD COLUMN     "value" TEXT NOT NULL;
