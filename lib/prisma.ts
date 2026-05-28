import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0
    ? global.prisma ?? new PrismaClient()
    : undefined;

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  global.prisma = prisma;
}
