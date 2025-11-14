-- AlterTable
ALTER TABLE "routines" ADD COLUMN     "is_cloned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "original_routine_id" UUID;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_original_routine_id_fkey" FOREIGN KEY ("original_routine_id") REFERENCES "routines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
