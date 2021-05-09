/*
  Warnings:

  - You are about to drop the column `product_id` on the `sale_details` table. All the data in the column will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `item_id` to the `sale_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sale_details` DROP FOREIGN KEY `sale_details_ibfk_1`;

-- AlterTable
ALTER TABLE `sale_details` DROP COLUMN `product_id`,
    ADD COLUMN     `item_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `products`;

-- CreateTable
CREATE TABLE `items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sale_details` ADD FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
