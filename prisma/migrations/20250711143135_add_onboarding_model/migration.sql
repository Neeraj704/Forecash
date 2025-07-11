/*
  Warnings:

  - You are about to drop the column `consentGiven` on the `Onboarding` table. All the data in the column will be lost.
  - Added the required column `consent` to the `Onboarding` table without a default value. This is not possible if the table is not empty.
  - Made the column `currency` on table `Onboarding` required. This step will fail if there are existing NULL values in that column.
  - Made the column `initialBalance` on table `Onboarding` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dailyLimit` on table `Onboarding` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Onboarding" DROP COLUMN "consentGiven",
ADD COLUMN     "consent" BOOLEAN NOT NULL,
ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "initialBalance" SET NOT NULL,
ALTER COLUMN "dailyLimit" SET NOT NULL;
