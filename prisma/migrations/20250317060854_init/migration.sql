-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "type" "UserType" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaProfile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "residence" TEXT NOT NULL,
    "passion" TEXT NOT NULL,
    "characterTraits" TEXT[],
    "otherTrait" TEXT,
    "roleModel" TEXT,
    "personalValues" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "dailyRoutine" TEXT NOT NULL,
    "obstacles" TEXT NOT NULL,
    "overcomingChallenges" TEXT NOT NULL,
    "handlingPressure" TEXT NOT NULL,
    "tenYearVision" TEXT NOT NULL,
    "fieldChange" TEXT NOT NULL,
    "bestAdvice" TEXT NOT NULL,
    "conversationStarter1" TEXT NOT NULL,
    "conversationStarter2" TEXT,
    "conversationStarter3" TEXT,
    "conversationStarter4" TEXT,

    CONSTRAINT "PersonaProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
