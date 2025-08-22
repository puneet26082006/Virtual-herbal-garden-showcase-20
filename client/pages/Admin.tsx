import PlaceholderPage from "./PlaceholderPage";
import { Shield } from "lucide-react";

export default function Admin() {
  return (
    <PlaceholderPage
      title="Admin Dashboard"
      description="Manage plant database, user accounts, content moderation, and system settings. Access administrative tools and analytics for the VirtualGarden platform."
      icon={<Shield className="h-12 w-12" />}
    />
  );
}
