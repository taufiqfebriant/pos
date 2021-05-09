/*
  Warnings:

  - You are about to drop the column `price` on the `sale_details` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `sale_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sale_details` DROP COLUMN `price`,
    ADD COLUMN     `unit_price` INTEGER NOT NULL;
