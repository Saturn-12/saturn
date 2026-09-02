import { and, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { Idea, InsertIdea, InsertUser, ideaConnections, ideas, users } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] === undefined) continue;
    values[field] = user[field] ?? null;
    updateSet[field] = user[field] ?? null;
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

type IdeaPayload = Omit<InsertIdea, "ownerId" | "id" | "createdAt" | "updatedAt" | "tags" | "starred"> & { tags: string[] | string; starred?: number | boolean };

const encodeIdea = (idea: IdeaPayload, ownerId: number): InsertIdea => ({
  ...idea,
  ownerId,
  tags: typeof idea.tags === "string" ? idea.tags : JSON.stringify(idea.tags),
  starred: idea.starred ? 1 : 0,
});

export const serializeIdea = (idea: Idea) => ({
  ...idea,
  tags: (() => { try { return JSON.parse(idea.tags) as string[]; } catch { return []; } })(),
  starred: Boolean(idea.starred),
});

export async function listIdeas(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(ideas).where(eq(ideas.ownerId, ownerId));
  return rows.map(serializeIdea);
}

export async function createIdea(ownerId: number, input: IdeaPayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(ideas).values(encodeIdea(input, ownerId));
  const id = Number(result[0].insertId);
  const created = await db.select().from(ideas).where(and(eq(ideas.id, id), eq(ideas.ownerId, ownerId))).limit(1);
  if (!created[0]) throw new Error("Idea was not created");
  return serializeIdea(created[0]);
}

export async function updateIdea(ownerId: number, id: number, patch: Partial<IdeaPayload>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const next: Record<string, unknown> = { ...patch };
  if (patch.tags) next.tags = JSON.stringify(patch.tags);
  if (patch.starred !== undefined) next.starred = patch.starred ? 1 : 0;
  await db.update(ideas).set(next).where(and(eq(ideas.id, id), eq(ideas.ownerId, ownerId)));
  const updated = await db.select().from(ideas).where(and(eq(ideas.id, id), eq(ideas.ownerId, ownerId))).limit(1);
  if (!updated[0]) throw new Error("Idea not found");
  return serializeIdea(updated[0]);
}

export async function deleteIdea(ownerId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(ideaConnections).where(and(eq(ideaConnections.ownerId, ownerId), or(eq(ideaConnections.fromIdeaId, id), eq(ideaConnections.toIdeaId, id))));
  await db.delete(ideas).where(and(eq(ideas.id, id), eq(ideas.ownerId, ownerId)));
  return { success: true } as const;
}

export async function listConnections(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ideaConnections).where(eq(ideaConnections.ownerId, ownerId));
}

export async function createConnection(ownerId: number, fromIdeaId: number, toIdeaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (fromIdeaId === toIdeaId) throw new Error("An idea cannot connect to itself");
  const owned = await db.select({ id: ideas.id }).from(ideas).where(and(eq(ideas.ownerId, ownerId), or(eq(ideas.id, fromIdeaId), eq(ideas.id, toIdeaId))));
  if (owned.length !== 2) throw new Error("Both ideas must belong to the current user");
  const existing = await db.select().from(ideaConnections).where(and(eq(ideaConnections.ownerId, ownerId), or(and(eq(ideaConnections.fromIdeaId, fromIdeaId), eq(ideaConnections.toIdeaId, toIdeaId)), and(eq(ideaConnections.fromIdeaId, toIdeaId), eq(ideaConnections.toIdeaId, fromIdeaId))))).limit(1);
  if (existing[0]) return existing[0];
  const result = await db.insert(ideaConnections).values({ ownerId, fromIdeaId, toIdeaId });
  const created = await db.select().from(ideaConnections).where(eq(ideaConnections.id, Number(result[0].insertId))).limit(1);
  if (!created[0]) throw new Error("Connection was not created");
  return created[0];
}
