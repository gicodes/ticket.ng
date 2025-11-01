-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TicketType" ADD VALUE 'INVOICE';
ALTER TYPE "TicketType" ADD VALUE 'ISSUE';
ALTER TYPE "TicketType" ADD VALUE 'TASK';
ALTER TYPE "TicketType" ADD VALUE 'TEST';
ALTER TYPE "TicketType" ADD VALUE 'RELEASE';
ALTER TYPE "TicketType" ADD VALUE 'SECURITY';
ALTER TYPE "TicketType" ADD VALUE 'DESIGN';
ALTER TYPE "TicketType" ADD VALUE 'MEETING';
ALTER TYPE "TicketType" ADD VALUE 'PERFORMANCE';
ALTER TYPE "TicketType" ADD VALUE 'MAINTENANCE';
ALTER TYPE "TicketType" ADD VALUE 'OPTIMIZATION';
ALTER TYPE "TicketType" ADD VALUE 'DOCUMENTATION';
ALTER TYPE "TicketType" ADD VALUE 'RESEARCH';
ALTER TYPE "TicketType" ADD VALUE 'DEPLOYMENT';
ALTER TYPE "TicketType" ADD VALUE 'TICKET';
