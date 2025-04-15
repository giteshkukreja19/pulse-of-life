
import { useState } from "react";
import { 
  Activity, Users, Calendar, Heart, Droplet, 
  Search, Filter, AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HospitalDashboardProps {
  onActionSuccess: (action: string) => void;
}

// Mock data
const pendingRequests = [
  { 
    id: "REQ-005", 
    patientName: "John Smith", 
    bloodGroup: "O+", 
    units: 2, 
    urgency: "High", 
    status: "Pending", 
    requestDate: "2025-04-12" 
  },
  { 
    id: "REQ-006", 
    patientName: "Sarah Johnson", 
    bloodGroup: "A-", 
    units: 1, 
    urgency: "Critical", 
    status: "Pending", 
    requestDate: "2025-04-14" 
  },
  { 
    id: "REQ-007", 
    patientName: "Michael Brown", 
    bloodGroup: "B+", 
    units: 3, 
    urgency: "Medium", 
    status: "Pending", 
    requestDate: "2025-04-10" 
  },
];

const availableDonors = [
  { 
    id: "D-001", 
    name: "David Wilson", 
    bloodGroup: "O+", 
    lastDonation: "2025-02-15", 
    distance: "2.3 miles", 
    status: "Available" 
  },
  { 
    id: "D-002", 
    name: "Emily Garcia", 
    bloodGroup: "A-", 
    lastDonation: "2025-01-22", 
    distance: "4.1 miles", 
    status: "Available" 
  },
  { 
    id: "D-003", 
    name: "James Rodriguez", 
    bloodGroup: "B+", 
    lastDonation: "2025-03-01", 
    distance: "1.7 miles", 
    status: "Available" 
  },
  { 
    id: "D-004", 
    name: "Sophia Lee", 
    bloodGroup: "O-", 
    lastDonation: "2025-02-28", 
    distance: "3.5 miles", 
    status: "Available" 
  },
];

const inventoryLevels = [
  { bloodGroup: "A+", available: 8, reserved: 2 },
  { bloodGroup: "A-", available: 3, reserved: 1 },
  { bloodGroup: "B+", available: 6, reserved: 1 },
  { bloodGroup: "B-", available: 2, reserved: 0 },
  { bloodGroup: "AB+", available: 1, reserved: 0 },
  { bloodGroup: "AB-", available: 1, reserved: 0 },
  { bloodGroup: "O+", available: 10, reserved: 3 },
  { bloodGroup: "O-", available: 5, reserved: 1 },
];

const HospitalDashboard = ({ onActionSuccess }: HospitalDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleContactDonor = (donorId: string) => {
    // In a real app, this would initiate contact with the donor
    onActionSuccess(`Contact initiated with donor ${donorId}`);
  };
  
  const handleFulfillRequest = (requestId: string) => {
    // In a real app, this would mark the request as fulfilled
    onActionSuccess(`Request ${requestId} marked as fulfilled`);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
      <p className="text-muted-foreground">
        Manage blood requests, donors, and inventory for Memorial Hospital
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
            <p className="text-xs text-muted-foreground mt-1">2 critical, 3 high, 3 medium</p>
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
            <p className="text-xs text-muted-foreground mt-1">Within 5 miles radius</p>
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
            <p className="text-xs text-muted-foreground mt-1">Scheduled for this week</p>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Pending Blood Requests</CardTitle>
                <CardDescription>Manage blood donation requests for your hospital</CardDescription>
              </div>
              <Button className="btn-blood">Create New Request</Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search requests..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80" 
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.patientName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-100">
                          {request.bloodGroup}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.units} units</TableCell>
                      <TableCell>
                        {request.urgency === "Critical" ? (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Critical
                          </Badge>
                        ) : request.urgency === "High" ? (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                            High
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            Medium
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleFulfillRequest(request.id)} 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Fulfill
                          </Button>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Donors</CardTitle>
              <CardDescription>Donors in your region who are available for donation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search donors..." className="w-80" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="p-2 border rounded-md">
                    <option value="">All Blood Types</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <select className="p-2 border rounded-md">
                    <option value="5">Within 5 miles</option>
                    <option value="10">Within 10 miles</option>
                    <option value="15">Within 15 miles</option>
                    <option value="20">Within 20 miles</option>
                  </select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Last Donation</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.id}</TableCell>
                      <TableCell>{donor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-100">
                          {donor.bloodGroup}
                        </Badge>
                      </TableCell>
                      <TableCell>{donor.lastDonation}</TableCell>
                      <TableCell>{donor.distance}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Available
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleContactDonor(donor.id)} 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Contact
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Inventory</CardTitle>
              <CardDescription>Current blood stock levels at your hospital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {inventoryLevels.map((item) => (
                  <Card key={item.bloodGroup} className={`${
                    item.available < 3 ? "bg-red-50" : "bg-white"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blood">{item.bloodGroup}</p>
                          <p className="text-sm text-muted-foreground">
                            Available: {item.available} units
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reserved: {item.reserved} units
                          </p>
                        </div>
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Droplet className="h-5 w-5 text-blood" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Inventory Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button className="btn-blood">Request Blood Transfer</Button>
                  <Button variant="outline">Update Inventory</Button>
                  <Button variant="outline">Generate Report</Button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Low Stock Alert</h3>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Critical Low Stock Alert</p>
                        <p className="text-sm text-red-700">
                          AB+ and B- blood types are critically low. Consider requesting a transfer or organizing 
                          a donation drive for these blood types.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalDashboard;
