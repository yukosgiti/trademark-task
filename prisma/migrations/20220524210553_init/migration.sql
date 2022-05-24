/*
  Warnings:

  - Added the required column `publicationSection` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "publicationSection" "PublicationSectionType" NOT NULL;
