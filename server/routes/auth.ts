import { RequestHandler } from "express";
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@shared/api";

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@virtualgarden.com",
    name: "Garden Admin",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Plant Enthusiast",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Simple mock password storage (in real app, use proper hashing)
const mockPasswords: Record<string, string> = {
  "admin@virtualgarden.com": "admin123",
  "user@example.com": "password123",
};

// Generate simple mock JWT token (in real app, use proper JWT library)
const generateMockToken = (userId: string): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Login endpoint
export const login: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password
    const storedPassword = mockPasswords[user.email];
    if (password !== storedPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateMockToken(user.id);

    const response: LoginResponse = {
      user,
      token,
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register endpoint
export const register: RequestHandler = (req, res) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: "Email, password, and name are required",
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: email.toLowerCase(),
      name,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    // Add to mock storage
    mockUsers.push(newUser);
    mockPasswords[newUser.email] = password;

    // Generate token
    const token = generateMockToken(newUser.id);

    const response: RegisterResponse = {
      user: newUser,
      token,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current user (requires token validation)
export const getCurrentUser: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization token required",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Simple token validation (extract user ID from mock token)
    const tokenParts = token.split("-");
    if (
      tokenParts.length < 4 ||
      tokenParts[0] !== "mock" ||
      tokenParts[1] !== "jwt" ||
      tokenParts[2] !== "token"
    ) {
      return res.status(401).json({
        error: "Invalid token format",
      });
    }

    const userId = tokenParts[3];
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout endpoint (client-side token removal)
export const logout: RequestHandler = (req, res) => {
  try {
    // In a real app, you might invalidate the token on the server side
    // For this mock implementation, we just return success
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Simple middleware to check if user is admin
export const requireAdmin: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization token required",
      });
    }

    const token = authHeader.substring(7);
    const tokenParts = token.split("-");
    const userId = tokenParts[3];
    const user = mockUsers.find((u) => u.id === userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    // Add user to request for use in route handlers
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
