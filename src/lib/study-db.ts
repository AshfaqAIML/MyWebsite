import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new (PrismaClient as any)({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  }),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
