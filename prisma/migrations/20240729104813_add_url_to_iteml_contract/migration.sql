/*
  Warnings:

  - Added the required column `url` to the `ItemContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemContract" ADD COLUMN     "url" TEXT NOT NULL;
