import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getPlants,
  getPlantById,
  getPlantCategories,
  getFeaturedPlants,
  getPlantStatistics,
} from "./routes/plants";
import {
  login,
  register,
  getCurrentUser,
  logout,
  requireAdmin,
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Plant routes
  app.get("/api/plants", getPlants);
  app.get("/api/plants/featured", getFeaturedPlants);
  app.get("/api/plants/categories", getPlantCategories);
  app.get("/api/plants/statistics", getPlantStatistics);
  app.get("/api/plants/:id", getPlantById);

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/auth/me", getCurrentUser);
  app.post("/api/auth/logout", logout);

  // Admin routes (protected)
  app.get("/api/admin/users", requireAdmin, (req, res) => {
    // Mock admin endpoint - return sanitized user list
    res.json({
      users: [
        {
          id: "1",
          email: "admin@virtualgarden.com",
          name: "Garden Admin",
          role: "admin",
        },
        {
          id: "2",
          email: "user@example.com",
          name: "Plant Enthusiast",
          role: "user",
        },
      ],
    });
  });

  // Admin plant management routes
  app.get("/api/admin/plants/statistics", requireAdmin, getPlantStatistics);

  // Admin category management
  app.get("/api/admin/categories", requireAdmin, getPlantCategories);
  app.post("/api/admin/categories", requireAdmin, (req, res) => {
    // Mock category creation
    res.json({ message: "Category created successfully", category: req.body });
  });
  app.put("/api/admin/categories/:id", requireAdmin, (req, res) => {
    // Mock category update
    res.json({ message: "Category updated successfully", category: req.body });
  });
  app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
    // Mock category deletion
    res.json({ message: "Category deleted successfully" });
  });

  // User permission management
  app.post("/api/admin/users/:id/permissions", requireAdmin, (req, res) => {
    // Mock permission assignment
    res.json({ message: "Permissions updated successfully" });
  });

  return app;
}
