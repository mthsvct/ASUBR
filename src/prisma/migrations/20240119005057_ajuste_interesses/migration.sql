/*
  Warnings:

  - You are about to drop the column `disciplinaId` on the `interesses` table. All the data in the column will be lost.
  - Added the required column `ofertaId` to the `interesses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "interesses" DROP CONSTRAINT "interesses_disciplinaId_fkey";

-- AlterTable
ALTER TABLE "interesses" DROP COLUMN "disciplinaId",
ADD COLUMN     "ofertaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "interesses" ADD CONSTRAINT "interesses_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "ofertas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
