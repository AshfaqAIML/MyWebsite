import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  try {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    });
    return new (PrismaClient as any)({ adapter });
  } catch (e) {
    console.warn("Prisma client unavailable:", e);
    return null;
  }
}

const client = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && client) {
  globalForPrisma.prisma = client as any;
}

export const prisma = client ?? (new Proxy({} as any, {
  get() {
    throw new Error(
      "Database unavailable. Prisma requires a writable filesystem for SQLite " +
      "(not available on Vercel Lambda). Use PostgreSQL for production deployment."
    );
  },
}) as PrismaClient);
