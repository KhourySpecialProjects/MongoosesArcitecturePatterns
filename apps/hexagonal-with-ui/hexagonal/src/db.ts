import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * PostgreSQL connection pool initialized with the connection string from environment variables.
 */
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

/**
 * Shared PrismaClient instance configured with the PostgreSQL pg adapter for database persistence.
 */
export const prisma = new PrismaClient({ adapter });
