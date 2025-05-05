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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useHospitals } from "@/hooks/useHospitals";
import HospitalUsersTable from "@/components/dashboard/HospitalUsersTable";
import { supabase } from "@/integrations/supabase/client";

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: hospitals = [], isLoading, error, refetch } = useHospitals();

  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // Update the hospital status in Supabase
      const { error } = await supabase
        .from('hospitals')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating hospital status:", error);
        toast.error(`Failed to update ${name} status: ${error.message}`);
        return;
      }
      
      // Success notification and refetch data
      toast.success(`${name}'s status changed to ${newStatus}`);
      refetch();
    } catch (err) {
      console.error("Exception when updating hospital status:", err);
      toast.error(`An unexpected error occurred. Please try again.`);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Hospitals</h1>
            <p className="text-muted-foreground">
              Manage registered hospitals and medical facilities
            </p>
          </div>
          <div className="flex w-full md:w-auto max-w-sm items-center space-x-2">
            <Input 
              placeholder="Search hospitals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Total Hospitals</CardTitle>
              <CardDescription>Registered medical facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blood">{hospitals.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Active Hospitals</CardTitle>
              <CardDescription>Currently operational facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                {hospitals.filter(h => h.status === 'active').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Inactive Hospitals</CardTitle>
              <CardDescription>Currently non-operational facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-500">
                {hospitals.filter(h => h.status !== 'active').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Registered Hospitals</CardTitle>
            <CardDescription>Manage hospital accounts and access</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading hospitals...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">Error loading hospitals. Please try again.</div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-4">No hospitals found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals
                    .filter(hospital => 
                      hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      hospital.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      hospital.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((hospital) => (
                      <TableRow key={hospital.id}>
                        <TableCell className="font-medium">{hospital.name}</TableCell>
                        <TableCell>{hospital.location}</TableCell>
                        <TableCell>{hospital.contact_person}</TableCell>
                        <TableCell>{hospital.phone}</TableCell>
                        <TableCell>{hospital.email}</TableCell>
                        <TableCell>
                          <Badge variant={hospital.status === "active" ? "default" : "secondary"}>
                            {hospital.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleToggleStatus(hospital.id, hospital.status || '', hospital.name)}
                              className={hospital.status === "active" 
                                ? "text-red-600 border-red-600 hover:bg-red-50"
                                : "text-green-600 border-green-600 hover:bg-green-50"
                              }
                            >
                              {hospital.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Hospital Users</CardTitle>
            <CardDescription>Users associated with hospital accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <HospitalUsersTable roleFilter="hospital" />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Hospitals;
