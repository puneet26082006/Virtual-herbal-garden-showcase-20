import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Droplets,
  Sun,
  Thermometer,
  MapPin,
  Calendar,
  Scissors,
  Heart,
  Share2,
  BookOpen,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ruler,
  Home
} from "lucide-react";
import { Plant } from "@shared/api";

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPlant(id);
    }
  }, [id]);

  const fetchPlant = async (plantId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/plants/${plantId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Plant not found");
        } else {
          throw new Error("Failed to fetch plant");
        }
        return;
      }
      
      const data = await response.json();
      setPlant(data);
    } catch (error) {
      console.error("Error fetching plant:", error);
      setError("Failed to load plant details");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToxicityInfo = (toxicity: string) => {
    switch (toxicity) {
      case 'non-toxic': return { icon: <CheckCircle className="h-4 w-4 text-green-600" />, label: 'Non-toxic', color: 'text-green-600' };
      case 'mildly-toxic': return { icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />, label: 'Mildly Toxic', color: 'text-yellow-600' };
      case 'toxic': return { icon: <AlertTriangle className="h-4 w-4 text-orange-600" />, label: 'Toxic', color: 'text-orange-600' };
      case 'highly-toxic': return { icon: <AlertTriangle className="h-4 w-4 text-red-600" />, label: 'Highly Toxic', color: 'text-red-600' };
      default: return { icon: <AlertTriangle className="h-4 w-4 text-gray-600" />, label: 'Unknown', color: 'text-gray-600' };
    }
  };

  const getSunlightIcon = (sunlight: string) => {
    switch (sunlight) {
      case 'full-sun': return { icon: '☀️', label: 'Full Sun' };
      case 'partial-sun': return { icon: '🌤️', label: 'Partial Sun' };
      case 'shade': return { icon: '🌑', label: 'Shade' };
      default: return { icon: '🌞', label: 'Variable' };
    }
  };

  const getWaterIcon = (water: string) => {
    switch (water) {
      case 'low': return { icon: '💧', label: 'Low Water' };
      case 'moderate': return { icon: '💧💧', label: 'Moderate Water' };
      case 'high': return { icon: '💧💧💧', label: 'High Water' };
      default: return { icon: '💧', label: 'Variable' };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !plant) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="outline" onClick={() => navigate('/plants')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plants
          </Button>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || "Plant not found"}
            </AlertDescription>
          </Alert>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Plant not found
            </h3>
            <p className="text-muted-foreground mb-4">
              The plant you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/plants">
              <Button>Browse All Plants</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const toxicityInfo = getToxicityInfo(plant.toxicity || 'non-toxic');
  const sunlightInfo = getSunlightIcon(plant.growingConditions.sunlight);
  const waterInfo = getWaterIcon(plant.growingConditions.water);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/plants')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plants
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-6xl">{plant.image}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {plant.name}
                  </h1>
                  <p className="text-xl text-muted-foreground italic mb-3">
                    {plant.scientificName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{plant.family}</Badge>
                    <Badge className={getDifficultyColor(plant.difficulty)}>
                      {plant.difficulty} care
                    </Badge>
                    <div className={`flex items-center space-x-1 ${toxicityInfo.color}`}>
                      {toxicityInfo.icon}
                      <span className="text-sm font-medium">{toxicityInfo.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>About This Plant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {plant.description}
                </p>
              </CardContent>
            </Card>

            {/* Uses */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Uses</CardTitle>
                <CardDescription>Common applications and benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {plant.uses.map((use, index) => (
                    <Badge key={index} variant="secondary">
                      {use}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medicinal Properties */}
            {plant.medicinalProperties && plant.medicinalProperties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Medicinal Properties</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {plant.medicinalProperties.map((property, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{property}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Culinary Uses */}
            {plant.culinaryUses && plant.culinaryUses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Culinary Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {plant.culinaryUses.map((use, index) => (
                      <Badge key={index} variant="outline">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Care Instructions */}
            {plant.careInstructions && plant.careInstructions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scissors className="h-5 w-5" />
                    <span>Care Instructions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plant.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Growing Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Growing Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Sunlight */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Sunlight</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{sunlightInfo.icon}</span>
                    <span className="text-sm text-muted-foreground">{sunlightInfo.label}</span>
                  </div>
                </div>

                {/* Water */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Water</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{waterInfo.icon}</span>
                    <span className="text-sm text-muted-foreground">{waterInfo.label}</span>
                  </div>
                </div>

                {/* Soil */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium">Soil</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-right">
                    {plant.growingConditions.soil}
                  </span>
                </div>

                {/* Hardiness */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Hardiness</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {plant.growingConditions.hardiness}
                  </span>
                </div>

                {/* Height */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Height</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {plant.growingConditions.height}
                  </span>
                </div>

                {/* Spacing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium">Spacing</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {plant.growingConditions.spacing}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Plant Info */}
            <Card>
              <CardHeader>
                <CardTitle>Plant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                
                {/* Native Region */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Native Region</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {plant.nativeRegion}
                  </span>
                </div>

                {/* Bloom Time */}
                {plant.growingConditions.bloomTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-pink-600" />
                      <span className="text-sm font-medium">Bloom Time</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {plant.growingConditions.bloomTime}
                    </span>
                  </div>
                )}

                {/* Harvest Time */}
                {plant.harvestTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Harvest Time</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {plant.harvestTime}
                    </span>
                  </div>
                )}

                {/* Propagation */}
                {plant.propagation && plant.propagation.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Propagation</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plant.propagation.map((method, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {plant.tags && plant.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {plant.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Companion Plants */}
            {plant.companionPlants && plant.companionPlants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Companion Plants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {plant.companionPlants.map((companion, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {companion}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
