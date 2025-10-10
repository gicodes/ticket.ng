-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('PERSONAL', 'BUSINESS');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "organization" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "teamSize" TEXT,
ADD COLUMN     "userType" "public"."UserType" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN     "website" TEXT;
