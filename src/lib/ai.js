// const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
import { z } from "zod";
import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";


const categorySchema = z.object({
    category: z.enum(["Important", "Promotional", "Marketting", "Spam", "General"]).describe("The category of the email"),
});

async function getClassification(message, oaiKey) {
  const client = Instructor({
    client: new OpenAI({
      apiKey: oaiKey,
    }),
    mode: "FUNCTIONS",
  });
  const category = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Categories the following email into the following categories: Important, Promotional, Marketting, Spam, General.  Important: Emails that are personal or work-related and require immediate attention. Promotions: Emails related to sales, discounts, and marketing campaigns. Social: Emails from social networks, friends, and family. Marketing: Emails related to marketing, newsletters, and notifications. Spam: Unwanted or unsolicited emails. General: If none of the above are matched, use General as the category.  Email: \n " + message ,
      },
    ],
    model: "gpt-4o",
    response_model: {
      schema: categorySchema,
      name: "category",
    },
  });
  return category;
}


export { getClassification };
