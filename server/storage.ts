import { type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type SiteConfig, type InsertSiteConfig } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import type { Store } from "express-session";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getSiteConfig(): Promise<SiteConfig | undefined>;
  updateSiteConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  sessionStore: Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private siteConfigData: SiteConfig | undefined;
  public sessionStore: Store;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.siteConfigData = undefined;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.password = hashedPassword;
      this.users.set(id, user);
    }
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const contactSubmission: ContactSubmission = {
      ...submission,
      message: submission.message ?? null,
      id,
      submittedAt: new Date(),
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async getSiteConfig(): Promise<SiteConfig | undefined> {
    return this.siteConfigData;
  }

  async updateSiteConfig(config: InsertSiteConfig): Promise<SiteConfig> {
    const id = this.siteConfigData?.id || randomUUID();
    this.siteConfigData = { 
      ...config, 
      id,
      resendApiKey: config.resendApiKey ?? null
    };
    return this.siteConfigData;
  }
}

export const storage = new MemStorage();
