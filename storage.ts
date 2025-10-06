import { 
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type BlogPost,
  type InsertBlogPost,
  type Service,
  type InsertService,
  type ContactSubmission,
  type InsertContactSubmission,
  type Experience,
  type InsertExperience,
  type Education,
  type InsertEducation,
  type Certification,
  type InsertCertification,
  users,
  projects,
  blogPosts,
  services,
  contactSubmissions,
  experiences,
  education,
  certifications
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, ilike, inArray } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjects(filters?: { categories?: string[], featured?: boolean }): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Blog Posts
  getBlogPosts(filters?: { categories?: string[], published?: boolean, featured?: boolean }): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Services
  getServices(activeOnly?: boolean): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Contact Submissions
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: string): Promise<ContactSubmission | undefined>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  markContactSubmissionProcessed(id: string): Promise<boolean>;

  // Experiences
  getExperiences(): Promise<Experience[]>;
  getExperience(id: string): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: string): Promise<boolean>;

  // Education
  getEducation(): Promise<Education[]>;
  getEducationItem(id: string): Promise<Education | undefined>;
  createEducation(educationItem: InsertEducation): Promise<Education>;
  updateEducation(id: string, educationItem: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducation(id: string): Promise<boolean>;

  // Certifications
  getCertifications(): Promise<Certification[]>;
  getCertification(id: string): Promise<Certification | undefined>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: string, certification: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Projects
  async getProjects(filters?: { categories?: string[], featured?: boolean }): Promise<Project[]> {
    const baseQuery = db.select().from(projects);
    
    const conditions = [];
    if (filters?.featured !== undefined) {
      conditions.push(eq(projects.featured, filters.featured));
    }
    if (filters?.categories?.length) {
      // This would need to be adjusted based on how you want to handle array filtering
      // For now, we'll assume categories is stored as JSONB array
      conditions.push(
        ...filters.categories.map(cat => 
          ilike(projects.categories as any, `%"${cat}"%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      return await baseQuery.where(and(...conditions)).orderBy(asc(projects.sortOrder), desc(projects.createdAt));
    }
    
    return await baseQuery.orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values([project as any]).returning();
    return created;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const updateData = { ...project, updatedAt: new Date() };
    const [updated] = await db
      .update(projects)
      .set(updateData as any)
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Blog Posts
  async getBlogPosts(filters?: { categories?: string[], published?: boolean, featured?: boolean }): Promise<BlogPost[]> {
    const baseQuery = db.select().from(blogPosts);
    
    const conditions = [];
    if (filters?.published !== undefined) {
      conditions.push(eq(blogPosts.published, filters.published));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(blogPosts.featured, filters.featured));
    }
    if (filters?.categories?.length) {
      conditions.push(
        ...filters.categories.map(cat => 
          ilike(blogPosts.categories as any, `%"${cat}"%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      return await baseQuery.where(and(...conditions)).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
    }
    
    return await baseQuery.orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values([post as any]).returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData = { ...post, updatedAt: new Date() };
    const [updated] = await db
      .update(blogPosts)
      .set(updateData as any)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Services
  async getServices(activeOnly = false): Promise<Service[]> {
    const baseQuery = db.select().from(services);
    if (activeOnly) {
      return await baseQuery.where(eq(services.active, true)).orderBy(asc(services.sortOrder));
    }
    return await baseQuery.orderBy(asc(services.sortOrder));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values([service as any]).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const updateData = { ...service, updatedAt: new Date() };
    const [updated] = await db
      .update(services)
      .set(updateData as any)
      .where(eq(services.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Contact Submissions
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission || undefined;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db.insert(contactSubmissions).values([submission]).returning();
    return created;
  }

  async markContactSubmissionProcessed(id: string): Promise<boolean> {
    const result = await db
      .update(contactSubmissions)
      .set({ processed: true })
      .where(eq(contactSubmissions.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).orderBy(asc(experiences.sortOrder), desc(experiences.startDate));
  }

  async getExperience(id: string): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience || undefined;
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const [created] = await db.insert(experiences).values([experience]).returning();
    return created;
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const [updated] = await db
      .update(experiences)
      .set({ ...experience, updatedAt: new Date() })
      .where(eq(experiences.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteExperience(id: string): Promise<boolean> {
    const result = await db.delete(experiences).where(eq(experiences.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return await db.select().from(education).orderBy(asc(education.sortOrder), desc(education.endDate));
  }

  async getEducationItem(id: string): Promise<Education | undefined> {
    const [educationItem] = await db.select().from(education).where(eq(education.id, id));
    return educationItem || undefined;
  }

  async createEducation(educationItem: InsertEducation): Promise<Education> {
    const [created] = await db.insert(education).values([educationItem]).returning();
    return created;
  }

  async updateEducation(id: string, educationItem: Partial<InsertEducation>): Promise<Education | undefined> {
    const [updated] = await db
      .update(education)
      .set({ ...educationItem, updatedAt: new Date() })
      .where(eq(education.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEducation(id: string): Promise<boolean> {
    const result = await db.delete(education).where(eq(education.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications).orderBy(asc(certifications.sortOrder), desc(certifications.issueDate));
  }

  async getCertification(id: string): Promise<Certification | undefined> {
    const [certification] = await db.select().from(certifications).where(eq(certifications.id, id));
    return certification || undefined;
  }

  async createCertification(certification: InsertCertification): Promise<Certification> {
    const [created] = await db.insert(certifications).values([certification]).returning();
    return created;
  }

  async updateCertification(id: string, certification: Partial<InsertCertification>): Promise<Certification | undefined> {
    const [updated] = await db
      .update(certifications)
      .set({ ...certification, updatedAt: new Date() })
      .where(eq(certifications.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCertification(id: string): Promise<boolean> {
    const result = await db.delete(certifications).where(eq(certifications.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
