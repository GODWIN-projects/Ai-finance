/*
  Warnings:

  - You are about to drop the column `recurringinterval` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "recurringinterval",
ADD COLUMN     "recurringInterval" "RecurringInterval";
