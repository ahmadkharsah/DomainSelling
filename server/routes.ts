import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertSiteConfigSchema } from "@shared/schema";
import { getUncachableResendClient } from "./lib/resend";
import { createOfferEmailHTML, createThankYouEmailHTML } from "./lib/emailTemplates";
import rateLimit from "express-rate-limit";
import { setupAuth } from "./auth";
import { hashPassword, verifyPassword } from "./auth";
import { z } from "zod";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  const ensureInitialized = async () => {
    const existingConfig = await storage.getSiteConfig();
    if (!existingConfig) {
      await storage.updateSiteConfig({
        domainName: "YourDomain.com",
        backgroundColor: "#FFFFFF",
        accentColor: "#000000",
        fontColor: "#000000",
        resendApiKey: undefined,
      });
    }

    const adminUser = await storage.getUserByUsername("admin");
    if (!adminUser) {
      await storage.createUser({
        username: "admin",
        password: await hashPassword("admin123"),
      });
    }
  };

  await ensureInitialized();

  app.get("/api/site-config", async (req, res) => {
    try {
      const config = await storage.getSiteConfig();
      if (!config) {
        return res.status(404).json({ error: "Site configuration not found" });
      }
      
      if (req.isAuthenticated()) {
        res.json(config);
      } else {
        const { resendApiKey, ...publicConfig } = config;
        res.json(publicConfig);
      }
    } catch (error) {
      console.error("Error fetching site config:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/site-config", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validationResult = insertSiteConfigSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const updatedConfig = await storage.updateSiteConfig(validationResult.data);
      const { resendApiKey, ...publicConfig } = updatedConfig;
      res.json(publicConfig);
    } catch (error) {
      console.error("Error updating site config:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  });

  app.post("/api/change-password", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validationResult = changePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.errors,
        });
      }

      const { currentPassword, newPassword } = validationResult.data;
      const user = await storage.getUserByUsername(req.user!.username);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isValidPassword = await verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedNewPassword);

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

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
      
      const adminEmailHtml = createOfferEmailHTML({
        fullName: data.fullName,
        email: data.email,
        offerAmount: data.offerAmount,
        message: data.message,
      });

      const thankYouEmailHtml = createThankYouEmailHTML({
        fullName: data.fullName,
        offerAmount: data.offerAmount,
        message: data.message,
      });

      await client.emails.send({
        from: fromEmail,
        to: fromEmail,
        replyTo: data.email,
        subject: "Domain Selling: Offer",
        html: adminEmailHtml,
      });

      await client.emails.send({
        from: fromEmail,
        to: data.email,
        subject: "Thank you for your offer",
        html: thankYouEmailHtml,
      });

      console.log("Emails sent successfully for submission:", submission.id);

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
