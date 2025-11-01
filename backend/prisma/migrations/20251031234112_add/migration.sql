-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[];
