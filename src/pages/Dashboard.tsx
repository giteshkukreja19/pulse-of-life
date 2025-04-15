
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DonorDashboard from "@/components/dashboard/DonorDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Calendar, Heart, Droplet, Hospital, FileText } from "lucide-react";

type UserRole = "donor" | "recipient" | "admin" | "hospital";

const Dashboard = () => {
  // In a real app, this would come from authentication
  const [userRole] = useState<UserRole>("donor");
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {userRole === "donor" ? (
          <DonorDashboard />
        ) : userRole === "recipient" ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Recipient Dashboard</h1>
            <p className="text-gray-500">
              View and manage your blood requests
            </p>
            <Card>
              <CardHeader>
                <CardTitle>My Blood Requests</CardTitle>
                <CardDescription>View and track your blood requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You have no active blood requests.</p>
              </CardContent>
            </Card>
          </div>
        ) : userRole === "admin" ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Manage users, requests, and blood banks
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">237</div>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">18</div>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Blood Banks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">12</div>
                    <Hospital className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">583</div>
                    <Droplet className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users">
              <TabsList className="mb-4">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </TabsTrigger>
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Requests</span>
                </TabsTrigger>
                <TabsTrigger value="banks" className="flex items-center gap-2">
                  <Hospital className="h-4 w-4" />
                  <span>Blood Banks</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Reports</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                    <CardDescription>View, edit and manage all registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">User management interface would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="requests" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Blood Requests</CardTitle>
                    <CardDescription>Monitor and manage all blood donation requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Blood request management interface would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="banks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Blood Banks</CardTitle>
                    <CardDescription>Manage registered blood banks and their inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Blood bank management interface would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports & Analytics</CardTitle>
                    <CardDescription>View statistics and generate reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Reporting interface would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
            <p className="text-gray-500">
              Manage blood inventory and donation requests
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">8</div>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Available Donors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">42</div>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">5</div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="requests">
              <TabsList className="mb-4">
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Blood Requests</span>
                </TabsTrigger>
                <TabsTrigger value="donors" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Nearby Donors</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Droplet className="h-4 w-4" />
                  <span>Inventory</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="requests" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>Blood donation requests in your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Blood request management interface would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="donors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Donors</CardTitle>
                    <CardDescription>Donors in your region who are available</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Donor list would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="inventory" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Blood Inventory</CardTitle>
                    <CardDescription>Current blood stock levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Inventory management interface would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
