import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Housing Advisor Endpoint
  app.post("/api/advisor/chat", async (req, res) => {
    try {
      const { message, history, userProfile } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Helpful fallback response when API key is not configured
        return res.json({
          reply: getFallbackAdvisorReply(message, userProfile),
          source: "built-in-knowledge",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are HavenHome AI, a compassionate, highly knowledgeable housing counselor specializing in low-income housing, HUD guidelines, Section 8 Housing Choice Vouchers, Area Median Income (AMI) calculations, application requirements, and tenant rights.
User Context (if available):
- Household Size: ${userProfile?.householdSize || "Not specified"}
- Annual Household Income: $${userProfile?.annualIncome || "Not specified"}
- Calculated AMI Category: ${userProfile?.amiCategory || "Not calculated yet"}
- Location: ${userProfile?.location || "General"}

Guidelines:
1. Provide practical, step-by-step, empathetic advice.
2. Explain legal or HUD terms simply (e.g. explain what 30% AMI vs 50% AMI means, or how Section 8 rent caps work).
3. If asked about required documents, list: Government Photo ID, Proof of Income (2-3 recent paystubs or W-2), Tax Returns, Proof of Benefits (SNAP, SSI, SSDI award letters), Bank Statements, and Rental History.
4. Always advocate for tenant rights and mention HUD Fair Housing protections against discrimination.
5. Keep answers concise, clear, and easy to read with bullet points where appropriate.`;

      // Format conversation history for Gemini chat if present
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const item of history) {
          contents.push({
            role: item.sender === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || "I'm sorry, I couldn't generate a response. Please try again.",
        source: "gemini",
      });
    } catch (error: any) {
      console.error("Gemini Advisor Error:", error);
      return res.status(500).json({
        reply: "I experienced an error connecting to our housing database. Here is a general tip: For immediate local low-income housing support, call 211 or visit HUD.gov.",
        error: error.message,
      });
    }
  });

  // Application submission endpoint
  app.post("/api/applications/submit", (req, res) => {
    const application = req.body;
    const refNumber = "HH-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);
    const submittedAt = new Date().toISOString();

    res.json({
      success: true,
      referenceNumber: refNumber,
      submittedAt,
      message: "Application successfully registered in the HavenHome portal system.",
      data: application,
    });
  });

  // Vite development or production static server setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HavenHome Server running on http://0.0.0.0:${PORT}`);
  });
}

function getFallbackAdvisorReply(message: string, profile: any): string {
  const msgLower = message.toLowerCase();

  if (msgLower.includes("ami") || msgLower.includes("income limit") || msgLower.includes("qualify")) {
    return "Area Median Income (AMI) is HUD's standard for qualifying affordable housing applicants.\n\n" +
      "• **Extremely Low Income (30% AMI)**: Household income is at or below 30% of the county median (e.g. ~$26,000/yr for family of 3 in most metros).\n" +
      "• **Very Low Income (50% AMI)**: Income is between 31% and 50% AMI (e.g. ~$43,000/yr).\n" +
      "• **Low Income (80% AMI)**: Income is between 51% and 80% AMI.\n\n" +
      "Use our **Check Eligibility Calculator** tab above to calculate your exact household AMI tier!";
  }

  if (msgLower.includes("document") || msgLower.includes("paperwork") || msgLower.includes("need")) {
    return "To apply for affordable housing, gather these required documents in advance:\n\n" +
      "1. **Government Photo ID** (State ID, Driver's License, Passport, or Green Card for adult members).\n" +
      "2. **Proof of Household Income** (3 consecutive pay stubs, 2024 W-2 / 1099, or tax return).\n" +
      "3. **Government Assistance Letters** (SNAP/Food stamps, SSI, SSDI, TANF, or Child Support statements).\n" +
      "4. **Bank Statements** (Last 2 months checking/savings account statements).\n" +
      "5. **Social Security Cards or ITINs** for all household members.\n" +
      "6. **Landlord References** (Contact details for previous rental history).";
  }

  if (msgLower.includes("section 8") || msgLower.includes("voucher")) {
    return "Yes! Over 95% of housing communities listed on HavenHome accept Section 8 Housing Choice Vouchers.\n\n" +
      "• Under Fair Housing rules and local Source of Income laws, landlords cannot deny your application solely because you pay with a Section 8 voucher.\n" +
      "• Your voucher standard bedroom count must match the unit, and your tenant portion is calculated by your local Housing Authority (usually 30% of your adjusted monthly income).";
  }

  if (msgLower.includes("waitlist") || msgLower.includes("how long")) {
    return "Waitlist times vary depending on property availability:\n\n" +
      "• **Immediate Availability**: Move-in ready or standard 1-3 month processing.\n" +
      "• **Open Waitlists**: Typically 6 to 18 months.\n" +
      "• **Priority Placement**: Veterans, victims of domestic violence, seniors, and persons with disabilities often qualify for preference points that move them up the queue.\n\n" +
      "We recommend applying to multiple open waitlists to increase your chances!";
  }

  return "Welcome to HavenHome Housing Support! I'm here to help you navigate affordable housing. You can ask me about:\n\n" +
    "• How to calculate your Area Median Income (AMI)\n" +
    "• Required documents for your application\n" +
    "• Using Section 8 Vouchers\n" +
    "• How waitlists work and priority status\n" +
    "• Fair Housing rights & tenant protection rules";
}

startServer();
