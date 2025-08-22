import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PlantSearchBar from "@/components/PlantSearchBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sun,
  Thermometer,
  AlertTriangle,
  Leaf,
  Clock,
  MapPin,
  Scissors,
} from "lucide-react";
import { Plant, PlantCategory, PlantsResponse } from "@shared/api";

interface SearchFilters {
  query: string;
  categories: string[];
  difficulty: string[];
  sunlight: string[];
  water: string[];
  toxicity: string[];
  tags: string[];
}

export default function Plants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<PlantCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    difficulty: [],
    sunlight: [],
    water: [],
    toxicity: [],
    tags: [],
  });

  const plantsPerPage = 12;

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch plants when filters or page changes
  useEffect(() => {
    fetchPlants();
  }, [currentFilters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/plants/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load plant categories");
    }
  };

  const fetchPlants = async () => {
    setSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: plantsPerPage.toString(),
      });

      if (currentFilters.query) params.append("q", currentFilters.query);
      if (currentFilters.categories.length > 0) {
        currentFilters.categories.forEach((cat) =>
          params.append("category", cat),
        );
      }
      if (currentFilters.difficulty.length > 0) {
        currentFilters.difficulty.forEach((diff) =>
          params.append("difficulty", diff),
        );
      }
      if (currentFilters.sunlight.length > 0) {
        currentFilters.sunlight.forEach((sun) =>
          params.append("sunlight", sun),
        );
      }
      if (currentFilters.water.length > 0) {
        currentFilters.water.forEach((water) => params.append("water", water));
      }
      if (currentFilters.toxicity.length > 0) {
        currentFilters.toxicity.forEach((tox) =>
          params.append("toxicity", tox),
        );
      }
      if (currentFilters.tags.length > 0) {
        currentFilters.tags.forEach((tag) => params.append("tags", tag));
      }

      const response = await fetch(`/api/plants?${params}`);
      if (!response.ok) throw new Error("Failed to fetch plants");

      const data: PlantsResponse = await response.json();
      setPlants(data.plants);
      setTotalResults(data.total);
      setTotalPages(Math.ceil(data.total / plantsPerPage));
    } catch (error) {
      console.error("Error fetching plants:", error);
      setError("Failed to load plants. Please try again.");
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "challenging":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getToxicityIcon = (toxicity: string) => {
    switch (toxicity) {
      case "non-toxic":
        return { icon: "✅", color: "text-green-600" };
      case "mildly-toxic":
        return { icon: "⚠️", color: "text-yellow-600" };
      case "toxic":
        return { icon: "⚠️", color: "text-orange-600" };
      case "highly-toxic":
        return { icon: "☠️", color: "text-red-600" };
      default:
        return { icon: "❓", color: "text-gray-600" };
    }
  };

  const getSunlightIcon = (sunlight: string) => {
    switch (sunlight) {
      case "full-sun":
        return "☀️";
      case "partial-sun":
        return "🌤️";
      case "shade":
        return "🌑";
      default:
        return "🌞";
    }
  };

  const getWaterIcon = (water: string) => {
    switch (water) {
      case "low":
        return "💧";
      case "moderate":
        return "💧💧";
      case "high":
        return "💧💧💧";
      default:
        return "💧";
    }
  };

  if (loading && plants.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Plant Species Database
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore our comprehensive collection of over 400 plant species.
            Search by name, category, growing conditions, or properties to find
            the perfect plants for your garden.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <PlantSearchBar
            onSearch={handleSearch}
            categories={categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
            }))}
            totalResults={totalResults}
            isLoading={searching}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Category Quick Filters */}
        {!currentFilters.query && currentFilters.categories.length === 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center space-y-2"
                  onClick={() =>
                    handleSearch({
                      ...currentFilters,
                      categories: [category.id],
                    })
                  }
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs text-center leading-tight">
                    {category.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {category.plantCount}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {plants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {plants.map((plant) => {
              const toxicity = getToxicityIcon(plant.toxicity || "non-toxic");
              return (
                <Card
                  key={plant.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {plant.image}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span
                          className={toxicity.color}
                          title={`Toxicity: ${plant.toxicity}`}
                        >
                          {toxicity.icon}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {plant.name}
                    </CardTitle>
                    <CardDescription className="italic text-sm">
                      {plant.scientificName}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Category & Difficulty */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {categories.find((cat) => cat.id === plant.category)
                          ?.name || plant.category}
                      </Badge>
                      <Badge
                        className={`text-xs ${getDifficultyColor(plant.difficulty)}`}
                      >
                        {plant.difficulty}
                      </Badge>
                    </div>

                    {/* Growing Conditions */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span
                          className="text-lg"
                          title={`Sunlight: ${plant.growingConditions.sunlight}`}
                        >
                          {getSunlightIcon(plant.growingConditions.sunlight)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Sun
                        </span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <span
                          className="text-lg"
                          title={`Water: ${plant.growingConditions.water}`}
                        >
                          {getWaterIcon(plant.growingConditions.water)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Water
                        </span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <span
                          className="text-lg"
                          title={`Native: ${plant.nativeRegion}`}
                        >
                          🌍
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Origin
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {plant.description}
                    </p>

                    {/* Primary Uses */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Primary Uses
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {plant.uses.slice(0, 3).map((use, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {use}
                          </Badge>
                        ))}
                        {plant.uses.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{plant.uses.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {plant.tags && plant.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {plant.tags.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* View Details Button */}
                    <Link to={`/plants/${plant.id}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No plants found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse our categories
                above.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  handleSearch({
                    query: "",
                    categories: [],
                    difficulty: [],
                    sunlight: [],
                    water: [],
                    toxicity: [],
                    tags: [],
                  })
                }
              >
                Clear all filters
              </Button>
            </div>
          )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || searching}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={searching}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || searching}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
