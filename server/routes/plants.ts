import { RequestHandler } from "express";
import { Plant, PlantsResponse, PlantCategory } from "@shared/api";

// Mock plant data for demonstration
const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    family: "Lamiaceae",
    description: "Lavender is a fragrant, purple-flowering plant native to the Mediterranean. Known for its calming properties and beautiful appearance, it's widely used in aromatherapy, cosmetics, and traditional medicine.",
    uses: ["Aromatherapy", "Stress Relief", "Sleep Aid", "Natural Fragrance", "Tea"],
    growingConditions: {
      sunlight: "full-sun",
      water: "low",
      soil: "Well-draining, sandy soil",
      hardiness: "USDA zones 5-9"
    },
    medicinalProperties: ["Anti-anxiety", "Anti-inflammatory", "Antiseptic", "Sedative"],
    image: "🌿",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis",
    family: "Asphodelaceae",
    description: "Aloe vera is a succulent plant species that grows in arid climates. The gel from its thick, fleshy leaves has been used for centuries for its healing and moisturizing properties.",
    uses: ["Skin Care", "Wound Healing", "Burns Treatment", "Digestive Health", "Hair Care"],
    growingConditions: {
      sunlight: "partial-sun",
      water: "low",
      soil: "Sandy, well-draining cactus mix",
      hardiness: "USDA zones 9-11"
    },
    medicinalProperties: ["Anti-inflammatory", "Healing", "Moisturizing", "Antimicrobial"],
    image: "🪴",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Chamomile",
    scientificName: "Matricaria chamomilla",
    family: "Asteraceae",
    description: "German chamomile is an annual herb with small, daisy-like flowers. It's one of the most popular herbal teas worldwide and has been used medicinally for thousands of years.",
    uses: ["Calming Tea", "Sleep Support", "Digestive Aid", "Skin Care", "Anti-inflammatory"],
    growingConditions: {
      sunlight: "full-sun",
      water: "moderate",
      soil: "Light, well-draining soil",
      hardiness: "Annual, all zones"
    },
    medicinalProperties: ["Sedative", "Anti-inflammatory", "Antispasmodic", "Carminative"],
    image: "🌼",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    name: "Echinacea",
    scientificName: "Echinacea purpurea",
    family: "Asteraceae",
    description: "Purple coneflower is a North American native perennial with striking purple petals and prominent cone centers. Widely used to support immune system health.",
    uses: ["Immune Support", "Cold Prevention", "Wound Healing", "Anti-inflammatory"],
    growingConditions: {
      sunlight: "full-sun",
      water: "moderate",
      soil: "Well-draining, fertile soil",
      hardiness: "USDA zones 3-9"
    },
    medicinalProperties: ["Immunostimulant", "Anti-inflammatory", "Antimicrobial", "Antiviral"],
    image: "🌸",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "5",
    name: "Peppermint",
    scientificName: "Mentha × piperita",
    family: "Lamiaceae",
    description: "Peppermint is a hybrid mint that's a cross between watermint and spearmint. Known for its refreshing scent and cooling properties.",
    uses: ["Digestive Aid", "Headache Relief", "Respiratory Support", "Natural Flavoring", "Tea"],
    growingConditions: {
      sunlight: "partial-sun",
      water: "high",
      soil: "Moist, rich soil",
      hardiness: "USDA zones 3-9"
    },
    medicinalProperties: ["Antispasmodic", "Decongestant", "Cooling", "Carminative"],
    image: "🌱",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "6",
    name: "Ginseng",
    scientificName: "Panax ginseng",
    family: "Araliaceae",
    description: "Asian ginseng is a slow-growing perennial plant with fleshy roots. Highly valued in traditional Chinese medicine for its adaptogenic properties.",
    uses: ["Energy Boost", "Stress Adaptation", "Cognitive Support", "Immune Enhancement"],
    growingConditions: {
      sunlight: "shade",
      water: "moderate",
      soil: "Rich, well-draining forest soil",
      hardiness: "USDA zones 3-7"
    },
    medicinalProperties: ["Adaptogenic", "Immunomodulatory", "Cognitive enhancer", "Anti-fatigue"],
    image: "🌿",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

const mockCategories: PlantCategory[] = [
  { id: "medicinal", name: "Medicinal Herbs", description: "Plants used for healing and health", plantCount: 4 },
  { id: "aromatic", name: "Aromatic Plants", description: "Fragrant plants for aromatherapy", plantCount: 2 },
  { id: "culinary", name: "Culinary Herbs", description: "Plants used in cooking and flavoring", plantCount: 2 },
  { id: "adaptogenic", name: "Adaptogenic Plants", description: "Plants that help body adapt to stress", plantCount: 1 }
];

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
