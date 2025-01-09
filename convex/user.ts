import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Sync or Create User
export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, email, name } = args;

    if (!userId || !email || !name) {
      throw new Error("Missing required user data.");
    }

    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!existingUser) {
      // Insert new user if they don't exist
      await ctx.db.insert("users", {
        userId,
        email,
        name,
        isPro: false,
        creditsLeft: 5, // Default credits
      });
    } else {
      // Update user details if they already exist
      await ctx.db.patch(existingUser._id, {
        email,
        name,
      });
    }
  },
});

// Get User by userId
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    if (!userId) {
      throw new Error("userId is required to fetch user data.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!user) {
      throw new Error(`User with userId ${userId} not found.`);
    }

    return user;
  },
});

// Update User
export const updateUser = mutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    isPro: v.optional(v.boolean()),
    creditsLeft: v.optional(v.number()),
    proSince: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, email, name, isPro, creditsLeft, proSince } = args;

    if (!userId) {
      throw new Error("userId is required to update user data.");
    }

    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!existingUser) {
      throw new Error(`User with userId ${userId} not found.`);
    }

    // Prepare the updates
    const updates: Partial<{
        email: string;
        name: string;
        isPro: boolean;
        creditsLeft: number;
        proSince?: number;
      }> = {};

    if (email) updates.email = email;
    if (name) updates.name = name;
    if (isPro !== undefined) updates.isPro = isPro;
    if (creditsLeft !== undefined) updates.creditsLeft = creditsLeft;
    if (proSince !== undefined) updates.proSince = proSince;

    // Apply updates
    await ctx.db.patch(existingUser._id, updates);
  },
});

// Delete User
export const deleteUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    console.log("Starting user deletion for:", userId);

    if (!userId) {
      throw new Error("userId is required to delete user data.");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id")  // Use the index
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

      if (!existingUser) {
        console.log("User not found:", userId);
        throw new Error(`User with userId ${userId} not found.`);
      }

    // Delete the user
    console.log("Found user to delete:", existingUser._id);
    await ctx.db.delete(existingUser._id);
    console.log("User deleted successfully");
  },
});


