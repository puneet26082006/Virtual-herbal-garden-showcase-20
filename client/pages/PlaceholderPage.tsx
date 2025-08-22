import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon = <Construction className="h-12 w-12" /> 
}: PlaceholderPageProps) {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <div className="flex justify-center text-muted-foreground">
              {icon}
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{description}</p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This page is under development. Please continue the conversation 
                to help build out this section of the application.
              </p>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
