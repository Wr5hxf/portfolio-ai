import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertBlogPostSchema,
  insertServiceSchema,
  insertContactSubmissionSchema,
  insertExperienceSchema,
  insertEducationSchema,
  insertCertificationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { categories, featured } = req.query;
      const filters: any = {};
      
      if (categories) {
        filters.categories = Array.isArray(categories) ? categories : [categories];
      }
      if (featured !== undefined) {
        filters.featured = featured === 'true';
      }
      
      const projects = await storage.getProjects(filters);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error });
    }
  });

  // Blog posts routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { categories, published, featured } = req.query;
      const filters: any = {};
      
      if (categories) {
        filters.categories = Array.isArray(categories) ? categories : [categories];
      }
      if (published !== undefined) {
        filters.published = published === 'true';
      }
      if (featured !== undefined) {
        filters.featured = featured === 'true';
      }
      
      const posts = await storage.getBlogPosts(filters);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data", error });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const activeOnly = req.query.active === 'true';
      const services = await storage.getServices(activeOnly);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data", error });
    }
  });

  // Contact submissions routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      const submission = await storage.createContactSubmission(validatedData);
      
      // TODO: Integrate with email service here
      // For now, just store the submission
      
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        id: submission.id
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data", error });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  // Experience routes
  app.get("/api/experience", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.post("/api/experience", async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data", error });
    }
  });

  // Education routes
  app.get("/api/education", async (req, res) => {
    try {
      const educationItems = await storage.getEducation();
      res.json(educationItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education" });
    }
  });

  app.post("/api/education", async (req, res) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const educationItem = await storage.createEducation(validatedData);
      res.status(201).json(educationItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data", error });
    }
  });

  // Certifications routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getCertifications();
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const validatedData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(validatedData);
      res.status(201).json(certification);
    } catch (error) {
      res.status(400).json({ message: "Invalid certification data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
