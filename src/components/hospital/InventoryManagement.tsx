
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { updateHospitalInventory } from "@/hooks/useHospitals";

interface InventoryManagementProps {
  hospitalId?: string;
}

interface InventoryItem {
  id: string;
  bloodGroup: string;
  units: number;
  lastUpdated: Date;
}

const InventoryManagement = ({ hospitalId }: InventoryManagementProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [newBloodGroup, setNewBloodGroup] = useState("A+");
  const [newUnits, setNewUnits] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [removeUnits, setRemoveUnits] = useState(1);
  
  // This would ideally come from a custom hook fetching data from Supabase
  // For now we'll use a static inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', bloodGroup: 'A+', units: 12, lastUpdated: new Date() },
    { id: '2', bloodGroup: 'A-', units: 5, lastUpdated: new Date() },
    { id: '3', bloodGroup: 'B+', units: 8, lastUpdated: new Date() },
    { id: '4', bloodGroup: 'O-', units: 3, lastUpdated: new Date() },
  ]);
  
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const handleAddInventory = async () => {
    if (!hospitalId) {
      toast({
        title: "Error",
        description: "Hospital ID is required to update inventory",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateHospitalInventory(
      hospitalId, 
      newBloodGroup, 
      newUnits, 
      'add'
    );
    
    if (success) {
      // Update local state for immediate UI feedback
      const existingGroup = inventory.find(item => item.bloodGroup === newBloodGroup);
      
      if (existingGroup) {
        setInventory(prev => prev.map(item => 
          item.bloodGroup === newBloodGroup 
            ? { ...item, units: item.units + newUnits, lastUpdated: new Date() } 
            : item
        ));
      } else {
        setInventory(prev => [
          ...prev, 
          { 
            id: Date.now().toString(), 
            bloodGroup: newBloodGroup, 
            units: newUnits, 
            lastUpdated: new Date() 
          }
        ]);
      }
      
      setIsAddDialogOpen(false);
      setNewUnits(1);
    }
  };
  
  const handleRemoveInventory = async () => {
    if (!hospitalId || !selectedItem) {
      toast({
        title: "Error",
        description: "Failed to remove inventory units",
        variant: "destructive"
      });
      return;
    }
    
    if (removeUnits > selectedItem.units) {
      toast({
        title: "Error",
        description: "Cannot remove more units than available",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateHospitalInventory(
      hospitalId, 
      selectedItem.bloodGroup, 
      removeUnits, 
      'remove'
    );
    
    if (success) {
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              units: item.units - removeUnits,
              lastUpdated: new Date()
            } 
          : item
      ).filter(item => item.units > 0)); // Remove if no units left
      
      setIsRemoveDialogOpen(false);
      setRemoveUnits(1);
      setSelectedItem(null);
    }
  };
  
  const openRemoveDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setRemoveUnits(1);
    setIsRemoveDialogOpen(true);
  };
  
  const filteredInventory = inventory.filter(item => 
    item.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalUnits = inventory.reduce((acc, item) => acc + item.units, 0);

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
          
          {inventory.length === 0 ? (
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
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {item.bloodGroup}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">{item.units}</TableCell>
                    <TableCell>{item.lastUpdated.toLocaleString()}</TableCell>
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
              <p className="font-semibold">{selectedItem?.bloodGroup}</p>
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
