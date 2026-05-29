let prismaClient: any = undefined;

declare global {
  var prisma: any;
}

async function initPrisma() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      if (!global.prisma) {
        global.prisma = new PrismaClient();
      }
      prismaClient = global.prisma;
    } catch (error) {
      console.warn("Prisma client not available, using fallback:", error instanceof Error ? error.message : String(error));
    }
  }
}

// Initialize synchronously if possible, otherwise will be undefined
if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
  try {
    // This will fail at build time if Prisma client isn't generated, but that's okay
    // The runtime will handle it gracefully
    const { PrismaClient } = require("@prisma/client");
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prismaClient = global.prisma;
  } catch (error) {
    // Prisma client not available - will use fallback data
  }
}

export const prisma = prismaClient;
export const initPrismaAsync = initPrisma;
