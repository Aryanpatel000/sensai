export const config = { runtime: "nodejs" };
import { inngest } from "@/lib/inngest/client";
import { generateIndustryInsights } from "@/lib/inngest/function";
import { serve } from "inngest/next";

export const { GET, POST, PUT, OPTIONS } = serve({
  client: inngest,
  functions: [
    generateIndustryInsights
  ],
});
