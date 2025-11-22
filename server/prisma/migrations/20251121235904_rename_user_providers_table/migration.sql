/*
  Warnings:

  - You are about to drop the `UserProviders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProviders" DROP CONSTRAINT "UserProviders_userId_fkey";

-- DropTable
DROP TABLE "UserProviders";

-- CreateTable
CREATE TABLE "user_providers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_providers_provider_providerId_key" ON "user_providers"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "user_providers" ADD CONSTRAINT "user_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
