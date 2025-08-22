import { RequestHandler } from "express";
import { Plant, PlantsResponse, PlantCategory } from "@shared/api";
import { generateFullPlantDatabase, plantCategories } from "../data/comprehensive-plants";

// Generate the comprehensive plant database
const allPlants = generateFullPlantDatabase();
const categories = plantCategories;

// Get all plants with optional filtering
export const getPlants: RequestHandler = (req, res) => {
  try {
    const { q, category, uses, page = 1, limit = 10 } = req.query;
    
    let filteredPlants = [...mockPlants];
    
    // Filter by search query
    if (q && typeof q === 'string') {
      const searchTerm = q.toLowerCase();
      filteredPlants = filteredPlants.filter(plant => 
        plant.name.toLowerCase().includes(searchTerm) ||
        plant.scientificName.toLowerCase().includes(searchTerm) ||
        plant.description.toLowerCase().includes(searchTerm) ||
        plant.uses.some(use => use.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by category (simplified - would be more complex with real categories)
    if (category && typeof category === 'string') {
      filteredPlants = filteredPlants.filter(plant => {
        if (category === 'medicinal') return plant.medicinalProperties && plant.medicinalProperties.length > 0;
        if (category === 'aromatic') return plant.uses.some(use => use.toLowerCase().includes('aroma'));
        if (category === 'culinary') return plant.uses.some(use => use.toLowerCase().includes('tea') || use.toLowerCase().includes('flavor'));
        return true;
      });
    }
    
    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedPlants = filteredPlants.slice(startIndex, endIndex);
    
    const response: PlantsResponse = {
      plants: paginatedPlants,
      total: filteredPlants.length,
      page: pageNum,
      limit: limitNum
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single plant by ID
export const getPlantById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const plant = mockPlants.find(p => p.id === id);
    
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    res.json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get plant categories
export const getPlantCategories: RequestHandler = (req, res) => {
  try {
    res.json(mockCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get featured plants (for homepage)
export const getFeaturedPlants: RequestHandler = (req, res) => {
  try {
    // Return first 3 plants as featured
    const featuredPlants = mockPlants.slice(0, 3);
    res.json(featuredPlants);
  } catch (error) {
    console.error('Error fetching featured plants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
