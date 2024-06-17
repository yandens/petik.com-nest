/*
  Warnings:

  - The `account_type` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BASIC', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "is_verified" SET DEFAULT false,
DROP COLUMN "account_type",
ADD COLUMN     "account_type" "AccountType" NOT NULL DEFAULT 'BASIC';
