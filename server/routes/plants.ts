import { RequestHandler } from "express";
import { Plant, PlantsResponse, PlantCategory } from "@shared/api";
import {
  generateFullPlantDatabase,
  plantCategories,
} from "../data/comprehensive-plants";

// Generate the comprehensive plant database
const allPlants = generateFullPlantDatabase();
const categories = plantCategories;

// Get all plants with advanced filtering
export const getPlants: RequestHandler = (req, res) => {
  try {
    const {
      q,
      category,
      difficulty,
      sunlight,
      water,
      toxicity,
      tags,
      page = 1,
      limit = 12,
    } = req.query;

    let filteredPlants = [...allPlants];

    // Filter by search query
    if (q && typeof q === "string") {
      const searchTerm = q.toLowerCase();
      filteredPlants = filteredPlants.filter(
        (plant) =>
          plant.name.toLowerCase().includes(searchTerm) ||
          plant.scientificName.toLowerCase().includes(searchTerm) ||
          plant.description.toLowerCase().includes(searchTerm) ||
          plant.uses.some((use) => use.toLowerCase().includes(searchTerm)) ||
          (plant.medicinalProperties &&
            plant.medicinalProperties.some((prop) =>
              prop.toLowerCase().includes(searchTerm),
            )) ||
          (plant.tags &&
            plant.tags.some((tag) => tag.toLowerCase().includes(searchTerm))) ||
          plant.nativeRegion.toLowerCase().includes(searchTerm) ||
          plant.family.toLowerCase().includes(searchTerm),
      );
    }

    // Filter by categories
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      filteredPlants = filteredPlants.filter((plant) =>
        categories.includes(plant.category),
      );
    }

    // Filter by difficulty
    if (difficulty) {
      const difficulties = Array.isArray(difficulty)
        ? difficulty
        : [difficulty];
      filteredPlants = filteredPlants.filter((plant) =>
        difficulties.includes(plant.difficulty),
      );
    }

    // Filter by sunlight requirements
    if (sunlight) {
      const sunlightReqs = Array.isArray(sunlight) ? sunlight : [sunlight];
      filteredPlants = filteredPlants.filter((plant) =>
        sunlightReqs.includes(plant.growingConditions.sunlight),
      );
    }

    // Filter by water requirements
    if (water) {
      const waterReqs = Array.isArray(water) ? water : [water];
      filteredPlants = filteredPlants.filter((plant) =>
        waterReqs.includes(plant.growingConditions.water),
      );
    }

    // Filter by toxicity
    if (toxicity) {
      const toxicityLevels = Array.isArray(toxicity) ? toxicity : [toxicity];
      filteredPlants = filteredPlants.filter(
        (plant) => plant.toxicity && toxicityLevels.includes(plant.toxicity),
      );
    }

    // Filter by tags
    if (tags) {
      const tagFilters = Array.isArray(tags) ? tags : [tags];
      filteredPlants = filteredPlants.filter(
        (plant) =>
          plant.tags && plant.tags.some((tag) => tagFilters.includes(tag)),
      );
    }

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedPlants = filteredPlants.slice(startIndex, endIndex);

    const response: PlantsResponse = {
      plants: paginatedPlants,
      total: filteredPlants.length,
      page: pageNum,
      limit: limitNum,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single plant by ID
export const getPlantById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const plant = allPlants.find((p) => p.id === id);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    res.json(plant);
  } catch (error) {
    console.error("Error fetching plant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get plant categories
export const getPlantCategories: RequestHandler = (req, res) => {
  try {
    // Update plant counts based on actual data
    const updatedCategories = categories.map((category) => ({
      ...category,
      plantCount: allPlants.filter((plant) => plant.category === category.id)
        .length,
    }));

    res.json(updatedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get featured plants (for homepage)
export const getFeaturedPlants: RequestHandler = (req, res) => {
  try {
    // Return a mix of plants from different categories
    const featuredPlants = [
      ...allPlants.filter((p) => p.category === "medicinal").slice(0, 1),
      ...allPlants.filter((p) => p.category === "culinary").slice(0, 1),
      ...allPlants.filter((p) => p.category === "aromatic").slice(0, 1),
    ];
    res.json(featuredPlants);
  } catch (error) {
    console.error("Error fetching featured plants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get plant statistics (for admin dashboard)
export const getPlantStatistics: RequestHandler = (req, res) => {
  try {
    const stats = {
      totalPlants: allPlants.length,
      categoriesCount: categories.length,
      byCategory: categories.map((category) => ({
        name: category.name,
        count: allPlants.filter((plant) => plant.category === category.id)
          .length,
      })),
      byDifficulty: {
        easy: allPlants.filter((plant) => plant.difficulty === "easy").length,
        moderate: allPlants.filter((plant) => plant.difficulty === "moderate")
          .length,
        challenging: allPlants.filter(
          (plant) => plant.difficulty === "challenging",
        ).length,
      },
      byToxicity: {
        "non-toxic": allPlants.filter((plant) => plant.toxicity === "non-toxic")
          .length,
        "mildly-toxic": allPlants.filter(
          (plant) => plant.toxicity === "mildly-toxic",
        ).length,
        toxic: allPlants.filter((plant) => plant.toxicity === "toxic").length,
        "highly-toxic": allPlants.filter(
          (plant) => plant.toxicity === "highly-toxic",
        ).length,
      },
      recentlyAdded: allPlants.slice(-10), // Last 10 plants added
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching plant statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
