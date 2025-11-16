import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "sensai",
  name: "Sensai",
  signingKey: process.env.INNGEST_SIGNING_KEY,  // 👈 ye line important hai
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
