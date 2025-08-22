import { useState, useEffect } from "react";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SearchFilters {
  query: string;
  categories: string[];
  difficulty: string[];
  sunlight: string[];
  water: string[];
  toxicity: string[];
  tags: string[];
}

interface PlantSearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  categories: Array<{ id: string; name: string; icon: string }>;
  totalResults?: number;
  isLoading?: boolean;
}

export default function PlantSearchBar({ 
  onSearch, 
  categories, 
  totalResults, 
  isLoading 
}: PlantSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    difficulty: [],
    sunlight: [],
    water: [],
    toxicity: [],
    tags: []
  });

  const difficultyOptions = [
    { id: "easy", label: "Easy" },
    { id: "moderate", label: "Moderate" },
    { id: "challenging", label: "Challenging" }
  ];

  const sunlightOptions = [
    { id: "full-sun", label: "Full Sun" },
    { id: "partial-sun", label: "Partial Sun" },
    { id: "shade", label: "Shade" }
  ];

  const waterOptions = [
    { id: "low", label: "Low Water" },
    { id: "moderate", label: "Moderate Water" },
    { id: "high", label: "High Water" }
  ];

  const toxicityOptions = [
    { id: "non-toxic", label: "Non-toxic" },
    { id: "mildly-toxic", label: "Mildly Toxic" },
    { id: "toxic", label: "Toxic" },
    { id: "highly-toxic", label: "Highly Toxic" }
  ];

  const popularTags = [
    "drought-tolerant", "indoor-plant", "pollinator-friendly", "aromatic",
    "easy-to-grow", "perennial", "annual", "native", "medicinal", "edible"
  ];

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedFilters = { ...filters, query: searchQuery };
      setFilters(updatedFilters);
      onSearch(updatedFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filter changes
  useEffect(() => {
    onSearch(filters);
  }, [filters]);

  const handleFilterToggle = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      query: "",
      categories: [],
      difficulty: [],
      sunlight: [],
      water: [],
      toxicity: [],
      tags: []
    });
  };

  const getActiveFilterCount = () => {
    return filters.categories.length + 
           filters.difficulty.length + 
           filters.sunlight.length + 
           filters.water.length + 
           filters.toxicity.length + 
           filters.tags.length;
  };

  const getActiveFilters = () => {
    const active = [];
    
    filters.categories.forEach(cat => {
      const category = categories.find(c => c.id === cat);
      if (category) active.push({ type: "category", value: cat, label: category.name });
    });
    
    filters.difficulty.forEach(diff => {
      const difficulty = difficultyOptions.find(d => d.id === diff);
      if (difficulty) active.push({ type: "difficulty", value: diff, label: difficulty.label });
    });
    
    filters.sunlight.forEach(sun => {
      const sunlight = sunlightOptions.find(s => s.id === sun);
      if (sunlight) active.push({ type: "sunlight", value: sun, label: sunlight.label });
    });
    
    filters.water.forEach(wat => {
      const water = waterOptions.find(w => w.id === wat);
      if (water) active.push({ type: "water", value: wat, label: water.label });
    });
    
    filters.toxicity.forEach(tox => {
      const toxicity = toxicityOptions.find(t => t.id === tox);
      if (toxicity) active.push({ type: "toxicity", value: tox, label: toxicity.label });
    });
    
    filters.tags.forEach(tag => {
      active.push({ type: "tags", value: tag, label: tag });
    });
    
    return active;
  };

  const removeFilter = (type: string, value: string) => {
    handleFilterToggle(type as keyof SearchFilters, value);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search plants by name, scientific name, or properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-base"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="h-12 px-4"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Results Summary */}
      {totalResults !== undefined && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {totalResults} {totalResults === 1 ? 'plant' : 'plants'} found
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Active Filters */}
      {getActiveFilters().length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getActiveFilters().map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter.type, filter.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <Card>
            <CardContent className="p-6 space-y-6">
              
              {/* Categories */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={filters.categories.includes(category.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterToggle("categories", category.id)}
                      className="justify-start h-auto py-2"
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Difficulty Level */}
              <div>
                <h3 className="font-medium mb-3">Difficulty Level</h3>
                <div className="flex flex-wrap gap-2">
                  {difficultyOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={filters.difficulty.includes(option.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterToggle("difficulty", option.id)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Growing Conditions */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Sunlight Requirements */}
                <div>
                  <h3 className="font-medium mb-3">Sunlight</h3>
                  <div className="space-y-2">
                    {sunlightOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant={filters.sunlight.includes(option.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterToggle("sunlight", option.id)}
                        className="w-full justify-start"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Water Requirements */}
                <div>
                  <h3 className="font-medium mb-3">Water Needs</h3>
                  <div className="space-y-2">
                    {waterOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant={filters.water.includes(option.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterToggle("water", option.id)}
                        className="w-full justify-start"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Toxicity */}
              <div>
                <h3 className="font-medium mb-3">Toxicity Level</h3>
                <div className="flex flex-wrap gap-2">
                  {toxicityOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={filters.toxicity.includes(option.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterToggle("toxicity", option.id)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Popular Tags */}
              <div>
                <h3 className="font-medium mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterToggle("tags", tag)}
                      className="text-xs"
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
