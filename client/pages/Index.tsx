import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import {
  Leaf,
  Search,
  BookOpen,
  Sprout,
  Heart,
  Shield,
  Users,
  ArrowRight,
  Flower,
  TreePine,
  Zap,
} from "lucide-react";

export default function Index() {
  const featuredPlants = [
    {
      name: "Lavender",
      scientificName: "Lavandula angustifolia",
      uses: ["Aromatherapy", "Stress Relief", "Sleep Aid"],
      image: "🌿",
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Aloe Vera",
      scientificName: "Aloe barbadensis",
      uses: ["Skin Care", "Wound Healing", "Digestive Health"],
      image: "🪴",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Chamomile",
      scientificName: "Matricaria chamomilla",
      uses: ["Calming Tea", "Anti-inflammatory", "Sleep Support"],
      image: "🌼",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Extensive Plant Database",
      description:
        "Explore thousands of plant species with detailed information about their properties, uses, and cultivation requirements.",
    },
    {
      icon: <Sprout className="h-8 w-8" />,
      title: "Virtual Garden Creation",
      description:
        "Design and manage your own virtual garden, experiment with different plant combinations and layouts.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Educational Resources",
      description:
        "Learn about traditional and modern uses of herbs, medicinal properties, and sustainable gardening practices.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Platform",
      description:
        "Connect with fellow garden enthusiasts, share experiences, and learn from expert botanists and herbalists.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-garden-mint/20 via-background to-garden-sage/20">
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2334d399" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-40'
          }
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-garden-mint text-garden-forest"
                >
                  🌱 Virtual Botanical Experience
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Discover the <span className="text-primary">Wisdom</span> of{" "}
                  <span className="text-garden-forest">Nature</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Explore our comprehensive virtual garden featuring thousands
                  of plant species, their medicinal properties, and traditional
                  uses. Create your own digital botanical sanctuary and learn
                  from nature's pharmacy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/plants">
                  <Button
                    size="lg"
                    className="group bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                  >
                    Explore Plants
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/garden">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Create Virtual Garden
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Flower className="h-4 w-4 text-garden-bloom" />
                  <span>5000+ Plant Species</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TreePine className="h-4 w-4 text-garden-forest" />
                  <span>Expert Curated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-garden-mint" />
                  <span>AI-Powered Search</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                    <div className="text-4xl mb-3">🌿</div>
                    <h3 className="font-semibold text-garden-forest">
                      Medicinal Herbs
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Traditional remedies
                    </p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
                    <div className="text-4xl mb-3">🌺</div>
                    <h3 className="font-semibold text-garden-forest">
                      Flowering Plants
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Beauty & aromatherapy
                    </p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
                    <div className="text-4xl mb-3">🪴</div>
                    <h3 className="font-semibold text-garden-forest">
                      Succulents
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Easy care plants
                    </p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                    <div className="text-4xl mb-3">🌳</div>
                    <h3 className="font-semibold text-garden-forest">
                      Trees & Shrubs
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Natural remedies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-16 bg-gradient-to-b from-background to-garden-sage/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Plant Species
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover some of the most popular and beneficial plants in our
              collection, each with unique properties and traditional uses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPlants.map((plant, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-garden-sage/20"
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {plant.image}
                  </div>
                  <CardTitle className="text-garden-forest">
                    {plant.name}
                  </CardTitle>
                  <CardDescription className="italic text-garden-moss">
                    {plant.scientificName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Traditional Uses:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {plant.uses.map((use, useIndex) => (
                        <Badge
                          key={useIndex}
                          variant="secondary"
                          className={plant.color}
                        >
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/plants">
              <Button variant="outline" size="lg" className="group">
                View All Plants
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Explore Nature
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources
              you need to learn about plants and create your virtual garden
              sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-garden-forest">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Start Your Virtual Garden Journey Today
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of plant enthusiasts and begin exploring the
              fascinating world of botanical knowledge and virtual gardening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/garden">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
                >
                  <Leaf className="mr-2 h-4 w-4" />
                  Explore Demo Garden
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
