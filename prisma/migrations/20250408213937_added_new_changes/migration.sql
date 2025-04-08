/*
  Warnings:

  - You are about to drop the column `description` on the `SystemPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SystemPrompt` table. All the data in the column will be lost.
  - You are about to drop the `ModelSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "SystemPrompt_name_key";

-- AlterTable
ALTER TABLE "SystemPrompt" DROP COLUMN "description",
DROP COLUMN "name";

-- DropTable
DROP TABLE "ModelSettings";

-- CreateTable
CREATE TABLE "ModelConfig" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModelConfig_provider_modelId_key" ON "ModelConfig"("provider", "modelId");
