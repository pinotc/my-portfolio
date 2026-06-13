import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", 
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: "7d", 
    updateAge: "1d",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "EDITOR",
      },
    },
  },
});