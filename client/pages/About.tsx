import PlaceholderPage from "./PlaceholderPage";
import { BookOpen } from "lucide-react";

export default function About() {
  return (
    <PlaceholderPage
      title="About VirtualGarden"
      description="Learn about our mission to make botanical knowledge accessible to everyone. Discover the story behind VirtualGarden and our commitment to educational excellence in plant science."
      icon={<BookOpen className="h-12 w-12" />}
    />
  );
}
