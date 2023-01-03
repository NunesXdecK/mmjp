-- DropForeignKey
ALTER TABLE "login_token" DROP CONSTRAINT "login_token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_message" DROP CONSTRAINT "subject_message_user_id_fkey";

-- AlterTable
ALTER TABLE "login_token" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subject_message" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "subject_message" ADD CONSTRAINT "subject_message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_token" ADD CONSTRAINT "login_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
