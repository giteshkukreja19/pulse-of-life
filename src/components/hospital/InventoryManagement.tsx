
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateHospitalInventory, useHospitalInventory, BloodInventoryItem } from "@/hooks/useHospitals";

interface InventoryManagementProps {
  hospitalId?: string;
}

const InventoryManagement = ({ hospitalId }: InventoryManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newBloodGroup, setNewBloodGroup] = useState("A+");
  const [newUnits, setNewUnits] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BloodInventoryItem | null>(null);
  const [removeUnits, setRemoveUnits] = useState(1);
  
  // Fetch real inventory data from the database
  const { data: inventoryData, isLoading, error, refetch } = useHospitalInventory(hospitalId || null);
  
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const handleAddInventory = async () => {
    if (!hospitalId) {
      toast.error("Hospital ID is required to update inventory");
      return;
    }
    
    const success = await updateHospitalInventory(
      hospitalId, 
      newBloodGroup, 
      newUnits, 
      'add'
    );
    
    if (success) {
      refetch(); // Refresh data after successful update
      setIsAddDialogOpen(false);
      setNewUnits(1);
    }
  };
  
  const handleRemoveInventory = async () => {
    if (!hospitalId || !selectedItem) {
      toast.error("Failed to remove inventory units");
      return;
    }
    
    if (removeUnits > selectedItem.units) {
      toast.error("Cannot remove more units than available");
      return;
    }
    
    const success = await updateHospitalInventory(
      hospitalId, 
      selectedItem.blood_group, 
      removeUnits, 
      'remove'
    );
    
    if (success) {
      refetch(); // Refresh data after successful update
      setIsRemoveDialogOpen(false);
      setRemoveUnits(1);
      setSelectedItem(null);
    }
  };
  
  const openRemoveDialog = (item: BloodInventoryItem) => {
    setSelectedItem(item);
    setRemoveUnits(1);
    setIsRemoveDialogOpen(true);
  };
  
  const filteredInventory = inventoryData ? inventoryData.filter((item: BloodInventoryItem) => 
    item.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const totalUnits = inventoryData ? inventoryData.reduce((acc: number, item: BloodInventoryItem) => acc + item.units, 0) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          Loading inventory data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading inventory data</p>
          <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Blood Inventory Management</CardTitle>
            <CardDescription>Track and manage your blood bank inventory</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-blood flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Inventory</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Blood Units</DialogTitle>
                <DialogDescription>
                  Add new units to your blood inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</label>
                  <select 
                    id="bloodGroup"
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="units" className="text-sm font-medium">Number of Units</label>
                  <Input 
                    id="units" 
                    type="number"
                    min="1"
                    value={newUnits}
                    onChange={(e) => setNewUnits(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button onClick={handleAddInventory} className="w-full">
                  Add to Inventory
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search by blood group..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64" 
              />
            </div>
            <p className="font-medium">Total: {totalUnits} units</p>
          </div>
          
          {(!inventoryData || inventoryData.length === 0) ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No inventory data available.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Start by adding your current blood stock levels.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units Available</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item: BloodInventoryItem) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {item.blood_group}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">{item.units}</TableCell>
                    <TableCell>{new Date(item.updated_at || '').toLocaleString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openRemoveDialog(item)}
                        className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                        <span>Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Blood Units</DialogTitle>
            <DialogDescription>
              Update inventory after usage or disposal
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Blood Group</p>
              <p className="font-semibold">{selectedItem?.blood_group}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Available Units</p>
              <p className="font-semibold">{selectedItem?.units}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="removeUnits" className="text-sm font-medium">Units to Remove</label>
              <Input 
                id="removeUnits" 
                type="number"
                min="1"
                max={selectedItem?.units}
                value={removeUnits}
                onChange={(e) => setRemoveUnits(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={handleRemoveInventory} className="w-full text-red-600 border-red-600 hover:bg-red-50">
              Remove Units
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryManagement;
