/*
  Warnings:

  - You are about to drop the `GoodsService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tradeMarkId` to the `ClassDescription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassDescription" DROP CONSTRAINT "ClassDescription_goodsServiceId_fkey";

-- DropForeignKey
ALTER TABLE "GoodsService" DROP CONSTRAINT "GoodsService_tradeMarkId_fkey";

-- AlterTable
ALTER TABLE "ClassDescription" ADD COLUMN     "tradeMarkId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "GoodsService";

-- AddForeignKey
ALTER TABLE "ClassDescription" ADD CONSTRAINT "ClassDescription_tradeMarkId_fkey" FOREIGN KEY ("tradeMarkId") REFERENCES "TradeMark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
