-- DropForeignKey
ALTER TABLE "public"."routines" DROP CONSTRAINT "routines_original_routine_id_fkey";

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_original_routine_id_fkey" FOREIGN KEY ("original_routine_id") REFERENCES "routines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
