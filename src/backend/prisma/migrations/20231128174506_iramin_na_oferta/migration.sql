/*
  Warnings:

  - You are about to drop the column `iraMin` on the `disciplinas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "disciplinas" DROP COLUMN "iraMin";

-- AlterTable
ALTER TABLE "ofertas" ADD COLUMN     "iraMin" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
