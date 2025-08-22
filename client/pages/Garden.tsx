import PlaceholderPage from "./PlaceholderPage";
import { Sprout } from "lucide-react";

export default function Garden() {
  return (
    <PlaceholderPage
      title="Virtual Garden Creator"
      description="Design and manage your own virtual garden. Experiment with different plant combinations, learn about companion planting, and create your personalized digital botanical sanctuary."
      icon={<Sprout className="h-12 w-12" />}
    />
  );
}
