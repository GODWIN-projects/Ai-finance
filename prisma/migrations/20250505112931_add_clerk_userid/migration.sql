/*
  Warnings:

  - You are about to drop the column `cleckYserId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cleckUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cleckUserId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_cleckYserId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cleckYserId",
ADD COLUMN     "cleckUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_cleckUserId_key" ON "users"("cleckUserId");
