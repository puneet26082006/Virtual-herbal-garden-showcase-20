/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Plant-related interfaces
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  category: string;
  description: string;
  uses: string[];
  growingConditions: {
    sunlight: "full-sun" | "partial-sun" | "shade";
    water: "low" | "moderate" | "high";
    soil: string;
    hardiness: string;
    climate: string;
    spacing: string;
    height: string;
    bloomTime?: string;
  };
  medicinalProperties?: string[];
  culinaryUses?: string[];
  toxicity?: "non-toxic" | "mildly-toxic" | "toxic" | "highly-toxic";
  difficulty: "easy" | "moderate" | "challenging";
  nativeRegion: string;
  image: string;
  tags: string[];
  careInstructions: string[];
  companionPlants?: string[];
  pests?: string[];
  diseases?: string[];
  harvestTime?: string;
  propagation: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlantCategory {
  id: string;
  name: string;
  description: string;
  plantCount: number;
  icon: string;
  color: string;
}

export interface PlantsResponse {
  plants: Plant[];
  total: number;
  page: number;
  limit: number;
}

export interface PlantSearchQuery {
  q?: string;
  category?: string;
  uses?: string[];
  page?: number;
  limit?: number;
}

// Authentication interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

// Virtual Garden interfaces
export interface VirtualGarden {
  id: string;
  userId: string;
  name: string;
  description: string;
  plants: GardenPlant[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GardenPlant {
  plantId: string;
  plantName: string;
  position: {
    x: number;
    y: number;
  };
  plantedAt: string;
  notes?: string;
}
