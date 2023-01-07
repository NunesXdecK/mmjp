/*
  Warnings:

  - A unique constraint covering the columns `[point_id]` on the table `point` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "point_point_id_key" ON "point"("point_id");
