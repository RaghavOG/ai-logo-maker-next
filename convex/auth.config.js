
export default {
    providers: [
      {
        domain: process.env.CLERK_JWT_KEY,
        applicationID: "convex",
      },
    ]
  };