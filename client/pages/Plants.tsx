import PlaceholderPage from "./PlaceholderPage";
import { Search } from "lucide-react";

export default function Plants() {
  return (
    <PlaceholderPage
      title="Plant Species Database"
      description="Explore our comprehensive collection of thousands of plant species, including detailed information about their properties, uses, cultivation requirements, and traditional applications."
      icon={<Search className="h-12 w-12" />}
    />
  );
}
