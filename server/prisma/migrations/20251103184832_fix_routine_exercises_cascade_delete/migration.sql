-- DropForeignKey
ALTER TABLE "public"."routine_exercises" DROP CONSTRAINT "routine_exercises_routine_id_fkey";

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
