
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useDonors } from "@/hooks/useDonors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Donors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: donors = [], isLoading, error } = useDonors();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // Get donors count by blood group
  const donorsByBloodGroup = bloodGroups.map(group => {
    const count = donors.filter(donor => donor.blood_group === group).length;
    return { group, count };
  });

  const handleContactDonor = (donorId: string, name: string) => {
    // In a real application, this would open a contact form or dialog
    toast.success(`Contacting donor ${name}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Donors</h1>
            <p className="text-muted-foreground">
              Manage and contact registered blood donors
            </p>
          </div>
          <div className="flex w-full md:w-auto max-w-sm items-center space-x-2">
            <Input 
              placeholder="Search donors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Total Donors</CardTitle>
              <CardDescription>Registered donors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blood">{donors.length}</p>
            </CardContent>
          </Card>

          {donorsByBloodGroup.filter(item => item.count > 0).slice(0, 3).map(item => (
            <Card key={item.group}>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{item.group}</CardTitle>
                <CardDescription>Registered donors</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blood">{item.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Donors</TabsTrigger>
            <TabsTrigger value="recent">Recent Donors</TabsTrigger>
            <TabsTrigger value="available">Available Now</TabsTrigger>
          </TabsList>

          {/* All Donors Tab */}
          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Registered Donors</CardTitle>
                <CardDescription>Complete list of all blood donors</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading donors...</div>
                ) : error ? (
                  <div className="text-center py-4 text-red-500">Error loading donors. Please try again.</div>
                ) : donors.length === 0 ? (
                  <div className="text-center py-4">No donors found.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Last Donation</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donors
                        .filter(donor => 
                          donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donor.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donor.blood_group?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((donor) => (
                          <TableRow key={donor.id}>
                            <TableCell className="font-medium">{donor.name}</TableCell>
                            <TableCell>
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {donor.blood_group}
                              </span>
                            </TableCell>
                            <TableCell>{donor.location}</TableCell>
                            <TableCell>{donor.phone}</TableCell>
                            <TableCell>{donor.email}</TableCell>
                            <TableCell>
                              {donor.last_donation ? new Date(donor.last_donation).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleContactDonor(donor.id, donor.name)}
                              >
                                Contact
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder tabs for future implementation */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donors</CardTitle>
                <CardDescription>People who have donated in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-4">Coming soon: View of recent donors</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="available">
            <Card>
              <CardHeader>
                <CardTitle>Available Donors</CardTitle>
                <CardDescription>Donors who are eligible to donate now</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground py-4">Coming soon: View of available donors</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Donors;
