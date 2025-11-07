import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { getUncachableResendClient } from "./lib/resend";
import { createOfferEmailHTML } from "./lib/emailTemplates";
import rateLimit from "express-rate-limit";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const honeypot = req.body.website;
      if (honeypot) {
        console.log("Spam detected: honeypot field filled");
        return res.status(400).json({ error: "Invalid submission" });
      }

      const validationResult = insertContactSubmissionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const data = validationResult.data;

      const submission = await storage.createContactSubmission(data);

      const { client, fromEmail } = await getUncachableResendClient();
      
      const emailHtml = createOfferEmailHTML({
        fullName: data.fullName,
        email: data.email,
        offerAmount: data.offerAmount,
        message: data.message,
      });

      await client.emails.send({
        from: fromEmail,
        to: fromEmail,
        replyTo: data.email,
        subject: "Domain Selling: Offer",
        html: emailHtml,
      });

      console.log("Email sent successfully for submission:", submission.id);

      return res.status(201).json({ 
        success: true, 
        message: "Your offer has been submitted successfully" 
      });

    } catch (error) {
      console.error("Error processing contact submission:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
