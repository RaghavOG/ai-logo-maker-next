Here's an updated `README.md` to include steps for setting up Clerk, Convex, and Webhooks:

---

# Next.js Project with Clerk, Convex, and Webhooks

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Run the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## Setup Clerk, Convex, and Webhooks

### 2. Set up Clerk and Convex

Follow these steps to integrate **Clerk** for authentication and **Convex** for backend functions.

- **Clerk Setup**: [Clerk Documentation](https://clerk.dev/docs)
- **Convex Setup**: [Convex Documentation](https://www.convex.dev/docs)

### 3. Configure Clerk Webhooks

After setting up **Clerk** and **Convex**, you'll need to configure Clerk to trigger webhooks in your Convex application.

1. Go to the **Clerk Dashboard**.
2. Under **Webhooks**, configure the webhook settings.
3. Add the webhook endpoint of your Convex app, which is saved in `.env.local` as:

```env
NEXT_PUBLIC_CONVEX_URL=https://<YOUR_CLOUD_NAME>.convex.cloud
```

4. **Important**: When entering the URL, **replace** `.cloud` with `.site`:

```text
https://<YOUR_CLOUD_NAME>.convex.site/clerk-webhook
```

Make sure to replace `<YOUR_CLOUD_NAME>` with your actual Convex project identifier.

### 4. Update Your `http.ts` in Convex

In your Convex setup, define the webhook route to handle incoming requests from Clerk.

In `http.ts` (or wherever your Convex routes are configured), add the following:

```ts
http.route({
  path: "/clerk-webhook",
  // Your handler logic here
});
```

This will ensure Convex is listening for webhooks sent to the `/clerk-webhook` path.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

This README provides a complete guide to setting up Clerk, Convex, and configuring the webhook to integrate them in your Next.js app.

