-- DropForeignKey
ALTER TABLE "public"."routine_exercises" DROP CONSTRAINT "routine_exercises_exercise_id_fkey";

-- AlterTable
ALTER TABLE "routine_exercises" ADD COLUMN     "custom_exercise_name" TEXT,
ALTER COLUMN "exercise_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
