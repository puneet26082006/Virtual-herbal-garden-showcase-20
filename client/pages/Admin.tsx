import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Settings,
  Users,
  Leaf as Plant,
  BarChart3,
  Shield,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Database,
  Activity,
} from "lucide-react";

interface PlantStatistics {
  totalPlants: number;
  categoriesCount: number;
  byCategory: Array<{ name: string; count: number }>;
  byDifficulty: { easy: number; moderate: number; challenging: number };
  byToxicity: {
    "non-toxic": number;
    "mildly-toxic": number;
    toxic: number;
    "highly-toxic": number;
  };
  recentlyAdded: any[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  permissions?: string[];
  createdAt?: string;
  lastLogin?: string;
  status?: "active" | "inactive" | "pending";
}

interface Category {
  id: string;
  name: string;
  description: string;
  plantCount: number;
  icon: string;
  color: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<PlantStatistics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "🌿",
    color: "bg-green-100 text-green-800",
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // Available permissions
  const availablePermissions = [
    "view_plants",
    "edit_plants",
    "delete_plants",
    "manage_categories",
    "manage_users",
    "view_analytics",
    "system_settings",
  ];

  // Chart colors
  const CHART_COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch plant statistics
      const statsResponse = await fetch("/api/admin/plants/statistics", {
        headers: {
          Authorization: `Bearer mock-admin-token`, // Mock auth for demo
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData);
      }

      // Fetch users
      const usersResponse = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer mock-admin-token`,
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        // Mock additional user data for demo
        const enhancedUsers = usersData.users.map(
          (user: any, index: number) => ({
            ...user,
            permissions:
              index === 0
                ? [
                    "manage_users",
                    "manage_categories",
                    "view_analytics",
                    "system_settings",
                  ]
                : ["view_plants"],
            createdAt: "2024-01-01T00:00:00Z",
            lastLogin:
              index === 0 ? "2024-01-15T10:30:00Z" : "2024-01-14T15:45:00Z",
            status: index === 0 ? "active" : "active",
          }),
        );
        setUsers(enhancedUsers);
      }

      // Fetch categories
      const categoriesResponse = await fetch("/api/admin/categories", {
        headers: {
          Authorization: `Bearer mock-admin-token`,
        },
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer mock-admin-token`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        setNewCategory({
          name: "",
          description: "",
          icon: "🌿",
          color: "bg-green-100 text-green-800",
        });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdateUserPermissions = async (
    userId: string,
    permissions: string[],
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer mock-admin-token`,
        },
        body: JSON.stringify({ permissions }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage plants, users, categories, and system settings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <Shield className="h-3 w-3" />
                <span>Admin Access</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Admin Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="plants" className="flex items-center space-x-2">
              <Plant className="h-4 w-4" />
              <span>Plants</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            {statistics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Plants
                      </CardTitle>
                      <Plant className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statistics.totalPlants}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Across {statistics.categoriesCount} categories
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {users.filter((u) => u.status === "active").length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {users.filter((u) => u.role === "admin").length} admins
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Categories
                      </CardTitle>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statistics.categoriesCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Classification system
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Growth Rate
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12%</div>
                      <p className="text-xs text-muted-foreground">
                        This month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Plants by Category */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Plants by Category</CardTitle>
                      <CardDescription>
                        Distribution across plant categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statistics.byCategory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Difficulty Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Difficulty Distribution</CardTitle>
                      <CardDescription>
                        Plants by care difficulty level
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Easy",
                                value: statistics.byDifficulty.easy,
                              },
                              {
                                name: "Moderate",
                                value: statistics.byDifficulty.moderate,
                              },
                              {
                                name: "Challenging",
                                value: statistics.byDifficulty.challenging,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[1, 2, 3].map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recently Added Plants</CardTitle>
                    <CardDescription>
                      Latest additions to the database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statistics.recentlyAdded
                        .slice(0, 5)
                        .map((plant, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{plant.image}</span>
                              <div>
                                <p className="font-medium">{plant.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {plant.scientificName}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">{plant.category}</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Plants Management Tab */}
          <TabsContent value="plants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plant Database Management</CardTitle>
                <CardDescription>
                  Manage plant species, categories, and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Plant
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Plants
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Database
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {statistics?.totalPlants} plants in database
                  </div>
                </div>

                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    Plant management features are available. Use the search and
                    filtering system on the Plants page to find and manage
                    specific species. The comprehensive database now contains{" "}
                    {statistics?.totalPlants} plants.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* User Search */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{user.name}</p>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                user.status === "active"
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          {user.permissions && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.permissions
                                .slice(0, 3)
                                .map((permission, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {permission.replace("_", " ")}
                                  </Badge>
                                ))}
                              {user.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setUserPermissions(user.permissions || []);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                        {user.role !== "admin" && (
                          <Button variant="outline" size="sm">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Permissions Modal */}
            {selectedUser && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Permissions: {selectedUser.name}</CardTitle>
                  <CardDescription>
                    Manage user access permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={permission}
                          checked={userPermissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserPermissions([
                                ...userPermissions,
                                permission,
                              ]);
                            } else {
                              setUserPermissions(
                                userPermissions.filter((p) => p !== permission),
                              );
                            }
                          }}
                          className="rounded border-border"
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Button
                      onClick={() =>
                        handleUpdateUserPermissions(
                          selectedUser.id,
                          userPermissions,
                        )
                      }
                    >
                      Save Permissions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(null);
                        setUserPermissions([]);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Categories Management Tab */}
          <TabsContent value="categories" className="space-y-6">
            {/* Add New Category */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Create a new plant category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-icon">Icon</Label>
                    <Input
                      id="category-icon"
                      value={newCategory.icon}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, icon: e.target.value })
                      }
                      placeholder="🌿"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe this category..."
                  />
                </div>
                <Button onClick={handleCreateCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </CardContent>
            </Card>

            {/* Existing Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
                <CardDescription>Manage plant categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {category.plantCount} plants
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <Badge className={category.color}>{category.name}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Database Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Database Management</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore Backup
                    </Button>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Require Admin Approval for New Users</Label>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-border"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable Two-Factor Authentication</Label>
                      <input
                        type="checkbox"
                        className="rounded border-border"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Log All Admin Actions</Label>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Performance Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Performance Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Enable Caching</Label>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-border"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label>Cache Duration (hours)</Label>
                      <Input type="number" defaultValue="24" className="w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
