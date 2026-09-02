import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing the Manus OAuth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const ideas = mysqlTable("ideas", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  tags: text("tags").notNull(),
  kind: varchar("kind", { length: 80 }).notNull(),
  color: varchar("color", { length: 32 }).notNull(),
  imageUrl: text("imageUrl"),
  note: text("note"),
  status: mysqlEnum("status", ["Raw", "Developing", "Building", "Archived"]).default("Raw").notNull(),
  resource: text("resource"),
  resourceLabel: varchar("resourceLabel", { length: 255 }),
  starred: int("starred").default(0).notNull(),
  positionX: int("positionX").default(4).notNull(),
  positionY: int("positionY").default(4).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const ideaConnections = mysqlTable("ideaConnections", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => users.id),
  fromIdeaId: int("fromIdeaId").notNull().references(() => ideas.id),
  toIdeaId: int("toIdeaId").notNull().references(() => ideas.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = typeof ideas.$inferInsert;
export type IdeaConnection = typeof ideaConnections.$inferSelect;
export type InsertIdeaConnection = typeof ideaConnections.$inferInsert;
