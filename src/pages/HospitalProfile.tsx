
import { useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";
import HospitalProfile from "@/components/hospital/HospitalProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryManagement from "@/components/hospital/InventoryManagement";
import { useHospitalProfile } from "@/hooks/useHospitals";

const HospitalProfilePage = () => {
  const { userId, isAuthenticated } = useContext(AuthContext);
  const { data: profile } = useHospitalProfile(userId);
  
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-xl font-semibold mb-2">Please Login</h2>
              <p className="text-muted-foreground">
                You need to be logged in to view your hospital profile.
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
          <h1 className="text-3xl font-bold">Hospital Management</h1>
          <p className="text-muted-foreground">
            View and manage your hospital profile and blood inventory
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <HospitalProfile />
          </TabsContent>
          
          <TabsContent value="inventory">
            {!profile ? (
              <Card>
                <CardHeader>
                  <CardTitle>Hospital Profile Required</CardTitle>
                  <CardDescription>
                    You need to create a hospital profile first
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Please create your hospital profile to manage inventory.</p>
                </CardContent>
              </Card>
            ) : (
              <InventoryManagement hospitalId={profile.id} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HospitalProfilePage;
