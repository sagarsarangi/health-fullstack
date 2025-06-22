require("dotenv").config();
const OpenAI = require("openai");

// Create OpenAI instance with your OpenRouter key
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // Important for OpenRouter
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001", // Optional: Replace with your actual site if deployed
    "X-Title": "Doctor Dashboard MCP Server",
  },
});

async function generatePrescription(symptoms) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite-preview-06-17",
      messages: [
        {
          role: "user",
          content: `You're a licensed doctor writing a prescription based on symptoms.

Keep it concise. Avoid any warnings, legal disclaimers, or generic pharmacist advice. Please provide only the necessary information for the prescription.

Symptoms: ${symptoms}

Return response in this format only:
Medicines:
- Medicine name – Dosage and frequency (1 line each for each medicine prescribed if multiple medicines are prescribed)

Dosage Instructions:
- Short, relevant lines (max 3). No disclaimers. Only practical instructions.
`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    return null;
  }
}

module.exports = { generatePrescription };
