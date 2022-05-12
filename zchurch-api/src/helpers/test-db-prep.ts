import { PrismaClient } from "@prisma/client";
import seedJonahBook from "../prisma/seeds/jonah";

const prisma = new PrismaClient();

export async function initializeZchurchTestDatabaseAsync() {
    await seedJonahBook();
}

export async function clearZchurchTestDatabaseAsync() {
    await prisma.$executeRaw`DROP SCHEMA IF EXISTS public CASCADE`;
}
