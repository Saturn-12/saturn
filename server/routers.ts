import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createConnection, createIdea, deleteIdea, listConnections, listIdeas, updateIdea } from "./db";
import { storagePut } from "./storage";

const statusSchema = z.enum(["Raw", "Developing", "Building", "Archived"]);

async function persistImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.startsWith("data:")) return imageUrl;
  const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return imageUrl;
  const [, contentType, encoded] = match;
  const extension = contentType.split("/")[1]?.replace("jpeg", "jpg") || "bin";
  const upload = await storagePut(`ideavault/idea.${extension}`, Buffer.from(encoded, "base64"), contentType);
  return upload.url;
}
const ideaFields = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).max(10),
  kind: z.string().trim().min(1).max(80),
  color: z.string().trim().min(1).max(32),
  imageUrl: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  status: statusSchema,
  resource: z.string().url().nullable().optional(),
  resourceLabel: z.string().max(255).nullable().optional(),
  starred: z.boolean().optional(),
  positionX: z.number().int().min(0).max(100).optional(),
  positionY: z.number().int().min(0).max(100).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  ideas: router({
    list: protectedProcedure.query(({ ctx }) => listIdeas(ctx.user.id)),
    create: protectedProcedure.input(ideaFields).mutation(async ({ ctx, input }) => createIdea(ctx.user.id, {
      ...input,
      imageUrl: await persistImage(input.imageUrl ?? null),
      note: input.note ?? null,
      resource: input.resource ?? null,
      resourceLabel: input.resourceLabel ?? null,
      starred: input.starred ? 1 : 0,
    })),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), patch: ideaFields.partial() })).mutation(async ({ ctx, input }) => updateIdea(ctx.user.id, input.id, {
      ...input.patch,
      imageUrl: await persistImage(input.patch.imageUrl),
      note: input.patch.note,
      resource: input.patch.resource,
      resourceLabel: input.patch.resourceLabel,
      starred: input.patch.starred === undefined ? undefined : input.patch.starred ? 1 : 0,
    })),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => deleteIdea(ctx.user.id, input.id)),
    connections: router({
      list: protectedProcedure.query(({ ctx }) => listConnections(ctx.user.id)),
      create: protectedProcedure.input(z.object({ fromIdeaId: z.number().int().positive(), toIdeaId: z.number().int().positive() })).mutation(({ ctx, input }) => createConnection(ctx.user.id, input.fromIdeaId, input.toIdeaId)),
    }),
  }),
});

export type AppRouter = typeof appRouter;
