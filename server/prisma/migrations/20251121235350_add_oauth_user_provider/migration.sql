-- DropForeignKey
ALTER TABLE "workout_sets" DROP CONSTRAINT "workout_sets_exercise_id_fkey";

-- CreateTable
CREATE TABLE "UserProviders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProviders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_custom_exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "category" "ExerciseType" NOT NULL DEFAULT 'STRENGTH',
    "primary_muscles" TEXT[],
    "secondary_muscles" TEXT[],
    "equipment" VARCHAR(80),
    "instructions" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_custom_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProviders_provider_providerId_key" ON "UserProviders"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_custom_exercises_user_id_name_key" ON "user_custom_exercises"("user_id", "name");

-- CreateIndex
CREATE INDEX "workout_sets_workout_id_custom_exercise_name_idx" ON "workout_sets"("workout_id", "custom_exercise_name");

-- AddForeignKey
ALTER TABLE "UserProviders" ADD CONSTRAINT "UserProviders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_custom_exercises" ADD CONSTRAINT "user_custom_exercises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
