import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import { serializeIdea } from "./db";
import type { TrpcContext } from "./_core/context";

const baseIdea = {
  id: 14,
  ownerId: 3,
  title: "A patient robot",
  description: "A machine that waits for the human to make the first move.",
  tags: '["robotics","care"]',
  kind: "FIELD NOTE 014",
  color: "lime",
  imageUrl: null,
  note: null,
  status: "Developing" as const,
  resource: null,
  resourceLabel: null,
  starred: 1,
  positionX: 42,
  positionY: 18,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("IdeaVault persistence", () => {
  it("serializes stored tags and stars into the UI shape", () => {
    expect(serializeIdea(baseIdea)).toMatchObject({
      id: 14,
      tags: ["robotics", "care"],
      starred: true,
    });
  });

  it("keeps malformed stored tags safe for the UI", () => {
    expect(serializeIdea({ ...baseIdea, tags: "not-json" }).tags).toEqual([]);
  });

  it("protects the idea list behind authentication", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.ideas.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" } satisfies Partial<TRPCError>);
  });
});
