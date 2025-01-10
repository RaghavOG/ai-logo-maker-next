import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all logos for a user
export const getUserLogos = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const logos = await ctx.db
      .query("logos")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    
    return logos;
  },
});

// Mutation to save a new logo
export const saveLogo = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    base64: v.string(),
    styles: v.optional(
      v.object({
        colorPalette: v.array(v.string()),
        designIdea: v.string(),
        theme: v.string(),
      })
    ),
    
  },
  handler: async (ctx, args) => {
    // First check if user exists and has credits

    console.log("I am here inside the saveLogo mutation");

    console.log(args.userId);
    console.log("I am here");
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.creditsLeft <= 0 && !user.isPro) {
      throw new Error("No credits left");
    }

    // Create the logo
    const logoId = await ctx.db.insert("logos", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      base64: args.base64,
      createdAt: Date.now(),
      styles: args.styles,
    });

    // Decrease credits if user is not pro
    if (!user.isPro) {
      await ctx.db.patch(user._id, {
        creditsLeft: user.creditsLeft - 1,
      });
    }

    return logoId;
  },
});

// Query to get a single logo by ID
export const getLogo = query({
  args: { id: v.id("logos") },
  handler: async (ctx, args) => {
    const logo = await ctx.db.get(args.id);
    return logo;
  },
});

// Query to get user's remaining credits
export const getUserCredits = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    
    return {
      creditsLeft: user?.creditsLeft ?? 0,
      isPro: user?.isPro ?? false,
    };
  },
});

export const getRandomLogos = query({
  args: {},
  handler: async (ctx) => {
    const allLogos = await ctx.db
      .query("logos")
      .order("desc")
      .take(8); // Get latest 8 logos
    
    // Shuffle the array to get random logos
    const shuffled = allLogos.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4); // Return 4 random logos
  },
});