-- Fix foreign key constraint to use SET NULL on delete for cloned routines
-- Drop the existing foreign key constraint
ALTER TABLE "routines" DROP CONSTRAINT IF EXISTS "routines_original_routine_id_fkey";

-- Add the foreign key constraint with SET NULL on delete
ALTER TABLE "routines" ADD CONSTRAINT "routines_original_routine_id_fkey"
FOREIGN KEY ("original_routine_id") REFERENCES "routines"("id") ON DELETE SET NULL;