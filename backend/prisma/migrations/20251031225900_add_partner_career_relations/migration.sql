-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'UPCOMING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PartnerRole" TEXT,
ADD COLUMN     "collab" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "position" TEXT;

-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT,
    "roles" TEXT[],
    "collab" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "open" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerApplication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "careerId" INTEGER,

    CONSTRAINT "CareerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_userId_key" ON "Partner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Career_userId_key" ON "Career"("userId");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career" ADD CONSTRAINT "Career_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerApplication" ADD CONSTRAINT "CareerApplication_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE SET NULL ON UPDATE CASCADE;
