
import { useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/App";
import HospitalUsersTable from "@/components/dashboard/HospitalUsersTable";

const HospitalDonors = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated || userRole !== 'hospital') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground">
                You need to be logged in as a hospital to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Blood Donors</h1>
          <p className="text-muted-foreground">
            View and manage blood donors in your area
          </p>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Donors</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="compatible">Compatible</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Registered Donors</CardTitle>
                <CardDescription>
                  Complete list of all blood donors in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HospitalUsersTable roleFilter="donor" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="available">
            <Card>
              <CardHeader>
                <CardTitle>Available Donors</CardTitle>
                <CardDescription>
                  Donors who are currently available for blood donation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Feature coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compatible">
            <Card>
              <CardHeader>
                <CardTitle>Compatible Donors</CardTitle>
                <CardDescription>
                  Donors whose blood type is compatible with current requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Feature coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HospitalDonors;
