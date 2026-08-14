import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

type PrismaClientCtor = new (options: { adapter: PrismaLibSql }) => PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  try {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    });
    return new (PrismaClient as unknown as PrismaClientCtor)({ adapter });
  } catch (e) {
    console.warn("Prisma client unavailable:", e);
    return null;
  }
}

const client = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && client) {
  globalForPrisma.prisma = client;
}

export const prisma = client ?? (new Proxy({} as PrismaClient, {
  get() {
    throw new Error(
      "Database unavailable. Prisma requires a writable filesystem for SQLite " +
      "(not available on Vercel Lambda). Use PostgreSQL for production deployment."
    );
  },
}) as PrismaClient);
