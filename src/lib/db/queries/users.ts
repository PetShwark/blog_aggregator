import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
    const [user] = await db.insert(users).values({ name: name }).returning();
    return user;
}

export async function getUserByName(name: string) {
    const [user] = await db.select().from(users).where(eq(users.name, name)).limit(1);
    return user;
}

export async function getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
}

export async function getUsers() {
    const usersList = await db.select().from(users);
    return usersList;
}

export async function deleteUsers() {
    await db.delete(users).execute();
}