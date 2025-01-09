import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema ({
    users:defineTable({
        userId: v.string(), // clerkId
        email: v.string(),
        name: v.string(),
        creditsLeft:v.number(),
        isPro: v.boolean(),
        proSince: v.optional(v.number()),
    }).index("by_user_id", ["userId"]), 

    logos: defineTable({
        userId: v.string(),
        name: v.string(),
        description: v.string(),
        base64: v.string(),
        createdAt: v.number(),
        styles: v.optional(v.object({
            colorPalette: v.array(v.string()),
            designIdea:v.string(),
            theme: v.string(),
        })),
        tags: v.optional(v.array(v.string())),
    }).index("by_user_id", ["userId"]),
});