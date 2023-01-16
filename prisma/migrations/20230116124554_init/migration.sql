-- DropForeignKey
ALTER TABLE "service_stage" DROP CONSTRAINT "service_stage_user_id_fkey";

-- AlterTable
ALTER TABLE "service_stage" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "service_stage" ADD CONSTRAINT "service_stage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
