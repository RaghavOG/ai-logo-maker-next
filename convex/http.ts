import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

// Define types for the webhook event data  // TODO: Define type  
type UserEventData = {
  id: string;
  deleted?: boolean;
  email_addresses?: Array<{ email_address: string }>;
  first_name?: string;
  last_name?: string;
  object?: string;
};

type WebhookPayload = {
  data: UserEventData;
  object: string;
  type: "user.created" | "user.updated" | "user.deleted";
};

// Type guard for user events
function isUserEvent(data: any): data is UserEventData {
  if (typeof data.id !== 'string') return false;
  
  if (data.deleted === true) return true;
  
  if (data.email_addresses) {
    return Array.isArray(data.email_addresses) &&
      data.email_addresses.every((email: any) => 
        typeof email === 'object' && typeof email.email_address === 'string'
      );
  }
  
  return false;
}

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.json() as WebhookPayload;
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.log("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;
    
    if (!isUserEvent(evt.data)) {
      return new Response("Invalid event data structure", { status: 400 });
    }

    const { id, email_addresses, first_name, last_name } = evt.data;
    
    if (!id) {
      return new Response("Missing user ID", { status: 400 });
    }

    const email = email_addresses?.[0]?.email_address || "";
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      switch (eventType) {
        case "user.created":
          await ctx.runMutation(api.user.syncUser, {
            userId: id,
            email: email,
            name: name || "Anonymous User",
          });
          break;

        case "user.updated":
          await ctx.runMutation(api.user.updateUser, {
            userId: id,
            email: email,
            name: name || "Anonymous User",
          });
          break;

        case "user.deleted":
          await ctx.runMutation(api.user.deleteUser, {
            userId: id,
          });
          break;

        default:
          return new Response(`Unhandled webhook event type: ${eventType}`, { 
            status: 400 
          });
      }

      return new Response("Webhook processed successfully", {
        status: 200,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("User not found")) {
        return new Response("User already deleted or not found", { status: 200 });
      }
      
      return new Response("Error processing webhook", {
        status: 500,
      });
    }
  }),
});

export default http;