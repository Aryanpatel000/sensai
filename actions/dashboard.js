"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_key);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// 🧠 Generate AI insights for a given industry
export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional text:

    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    Return only the JSON, no markdown or notes.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

// 🚀 Main function to get or create/update insights
export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // ✅ Check if an insight for this industry already exists
  let existingInsight = await db.industryInsight.findUnique({
    where: { industry: user.industry },
  });

  // If no insight found, generate a new one
  if (!existingInsight) {
    const insights = await generateAIInsights(user.industry);

    const safeInsights = {
      ...insights,
      demandLevel: insights.demandLevel || "Medium",
      marketOutlook: insights.marketOutlook || "Neutral",
    };

    existingInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...safeInsights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
      },
    });
  } else {
    // Otherwise, update the existing insight
    const insights = await generateAIInsights(user.industry);

    const safeInsights = {
      ...insights,
      demandLevel: insights.demandLevel || "Medium",
      marketOutlook: insights.marketOutlook || "Neutral",
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    existingInsight = await db.industryInsight.update({
      where: { industry: user.industry },
      data: safeInsights,
    });
  }

  return existingInsight;
}
