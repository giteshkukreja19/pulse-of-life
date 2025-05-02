
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Plus, Trash } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface BloodInventoryItem {
  id: string;
  blood_group: string;
  units_available: number;
  last_updated: string;
  hospital_id?: string;
  hospital_name?: string;
}

const BloodInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch blood inventory data
  const { data: inventory = [], isLoading, error, refetch } = useQuery({
    queryKey: ["blood-inventory"],
    queryFn: async () => {
      try {
        // This is a placeholder - in a real application, you would fetch from your inventory table
        // Mocked data for now
        const mockInventory: BloodInventoryItem[] = [
          {
            id: "1",
            blood_group: "A+",
            units_available: 45,
            last_updated: new Date().toISOString(),
            hospital_name: "City General Hospital"
          },
          {
            id: "2",
            blood_group: "O-",
            units_available: 12,
            last_updated: new Date().toISOString(),
            hospital_name: "Memorial Medical Center"
          },
          {
            id: "3",
            blood_group: "B+",
            units_available: 28,
            last_updated: new Date().toISOString(),
            hospital_name: "St. Joseph's Hospital"
          },
          {
            id: "4",
            blood_group: "AB+",
            units_available: 7,
            last_updated: new Date().toISOString(),
            hospital_name: "University Medical Center"
          },
          {
            id: "5",
            blood_group: "A-",
            units_available: 15,
            last_updated: new Date().toISOString(),
            hospital_name: "City General Hospital"
          },
          {
            id: "6",
            blood_group: "O+",
            units_available: 52,
            last_updated: new Date().toISOString(),
            hospital_name: "Memorial Medical Center"
          },
          {
            id: "7",
            blood_group: "B-",
            units_available: 9,
            last_updated: new Date().toISOString(),
            hospital_name: "St. Joseph's Hospital"
          },
          {
            id: "8",
            blood_group: "AB-",
            units_available: 3,
            last_updated: new Date().toISOString(),
            hospital_name: "University Medical Center"
          }
        ];
        
        return mockInventory;
      } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
      }
    }
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // Calculate total units
  const totalUnits = inventory.reduce((acc, item) => acc + item.units_available, 0);
  
  // Get units by blood group
  const unitsByBloodGroup = bloodGroups.map(group => {
    const items = inventory.filter(item => item.blood_group === group);
    const total = items.reduce((sum, item) => sum + item.units_available, 0);
    return { group, total };
  });

  const handleAddUnits = (bloodGroup: string) => {
    // This would be implemented to connect with your database
    toast.success(`Added units to ${bloodGroup} inventory`);
    refetch();
  };

  const handleRemoveUnits = (bloodGroup: string) => {
    // This would be implemented to connect with your database
    toast.success(`Removed units from ${bloodGroup} inventory`);
    refetch();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blood Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage blood units across all blood banks and hospitals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Total Units</CardTitle>
              <CardDescription>Available blood units</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blood">{totalUnits}</p>
            </CardContent>
          </Card>

          {unitsByBloodGroup.filter(item => item.total > 0).slice(0, 3).map(item => (
            <Card key={item.group}>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{item.group}</CardTitle>
                <CardDescription>Available units</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blood">{item.total}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Blood Inventory Details</CardTitle>
              <CardDescription>Manage blood units by group and hospital</CardDescription>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                placeholder="Search inventory..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading inventory data...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">Error loading inventory data. Please try again.</div>
            ) : inventory.length === 0 ? (
              <div className="text-center py-4">No inventory data found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units Available</TableHead>
                    <TableHead>Hospital/Blood Bank</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory
                    .filter(item => 
                      item.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {item.blood_group}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">{item.units_available}</TableCell>
                        <TableCell>{item.hospital_name}</TableCell>
                        <TableCell>{new Date(item.last_updated).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAddUnits(item.blood_group)}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveUnits(item.blood_group)}
                              className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                              <span>Remove</span>
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
      </div>
    </MainLayout>
  );
};

export default BloodInventory;
