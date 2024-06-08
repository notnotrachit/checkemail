// const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
import { z } from "zod";
import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";


const categorySchema = z.object({
    category: z.enum(["Important", "Promotional", "Marketting", "Spam"]).describe("The category of the email"),
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
        content: message,
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
