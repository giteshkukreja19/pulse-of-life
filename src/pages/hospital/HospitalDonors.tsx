
import { useContext, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/App";
import HospitalUsersTable from "@/components/dashboard/HospitalUsersTable";
import { useDonors } from "@/hooks/useDonors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const HospitalDonors = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const { data: donors, isLoading, error } = useDonors();
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter donors based on search term
  const filteredDonors = donors?.filter(donor => 
    donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.blood_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Blood Donors</h1>
          <p className="text-muted-foreground">
            View and manage blood donors in your area
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search donors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-blood hover:bg-blood/90">Request Blood</Button>
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
                {isLoading ? (
                  <div className="text-center py-8">Loading donors...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    Error loading donors: {error.message}
                  </div>
                ) : (
                  <HospitalUsersTable roleFilter="donor" customData={filteredDonors} />
                )}
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
                {isLoading ? (
                  <div className="text-center py-8">Loading donors...</div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Feature coming soon</p>
                  </div>
                )}
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
                {isLoading ? (
                  <div className="text-center py-8">Loading donors...</div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Feature coming soon</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HospitalDonors;
