-- Add support for custom exercises in workout sets
-- This allows logging sets for exercises that don't exist in the main exercise table

-- Add optional custom exercise fields to workout_sets
ALTER TABLE workout_sets
ADD COLUMN custom_exercise_name VARCHAR(120),
ADD COLUMN custom_exercise_category VARCHAR(20),
ADD COLUMN custom_exercise_primary_muscles TEXT[];

-- Make exerciseId optional since we can now have custom exercises
ALTER TABLE workout_sets
ALTER COLUMN exercise_id DROP NOT NULL;

-- Add constraint to ensure either exerciseId OR custom exercise name is provided
ALTER TABLE workout_sets
ADD CONSTRAINT workout_sets_exercise_check
CHECK (
  (exercise_id IS NOT NULL AND custom_exercise_name IS NULL) OR
  (exercise_id IS NULL AND custom_exercise_name IS NOT NULL)
);

-- Add index for custom exercise queries
CREATE INDEX idx_workout_sets_custom_exercise ON workout_sets(custom_exercise_name) WHERE custom_exercise_name IS NOT NULL;