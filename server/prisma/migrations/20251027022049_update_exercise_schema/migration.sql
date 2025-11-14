/*
  Warnings:

  - You are about to drop the column `difficulty` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `muscle` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `exercises` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[exercise_id]` on the table `exercises` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Force" AS ENUM ('PUSH', 'PULL', 'STATIC');

-- CreateEnum
CREATE TYPE "Mechanic" AS ENUM ('COMPOUND', 'ISOLATION');

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "difficulty",
DROP COLUMN "muscle",
DROP COLUMN "type",
DROP COLUMN "video_url",
ADD COLUMN     "category" "ExerciseType",
ADD COLUMN     "exercise_id" VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN     "force" "Force",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "level" "Difficulty",
ADD COLUMN     "mechanic" "Mechanic",
ADD COLUMN     "primary_muscles" TEXT[],
ADD COLUMN     "secondary_muscles" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "exercises_exercise_id_key" ON "exercises"("exercise_id");
