
import { useState } from "react";
import { 
  Users, Activity, Hospital, Droplet, Calendar, 
  FileText, Settings, PieChart, UserCheck, Database
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatCard from "./StatCard";

interface AdminDashboardProps {
  onActionSuccess: (action: string) => void;
}

// Mock data for admin dashboard
const recentRequests = [
  { id: "REQ-001", bloodGroup: "O+", units: 2, hospital: "Memorial Hospital", urgency: "High", status: "Pending" },
  { id: "REQ-002", bloodGroup: "A-", units: 1, hospital: "City Medical Center", urgency: "Medium", status: "Fulfilled" },
  { id: "REQ-003", bloodGroup: "B+", units: 3, hospital: "University Hospital", urgency: "Critical", status: "Pending" },
  { id: "REQ-004", bloodGroup: "AB+", units: 1, hospital: "St. Mary's Hospital", urgency: "Low", status: "Fulfilled" },
];

const registeredHospitals = [
  { id: "H-001", name: "Memorial Hospital", location: "Downtown", contactPerson: "Dr. Smith", bloodBankStatus: "Active" },
  { id: "H-002", name: "City Medical Center", location: "Westside", contactPerson: "Dr. Johnson", bloodBankStatus: "Active" },
  { id: "H-003", name: "University Hospital", location: "Campus Area", contactPerson: "Dr. Williams", bloodBankStatus: "Inactive" },
];

const bloodInventory = [
  { bloodGroup: "A+", available: 15, reserved: 3 },
  { bloodGroup: "A-", available: 8, reserved: 1 },
  { bloodGroup: "B+", available: 12, reserved: 2 },
  { bloodGroup: "B-", available: 5, reserved: 0 },
  { bloodGroup: "AB+", available: 4, reserved: 1 },
  { bloodGroup: "AB-", available: 2, reserved: 0 },
  { bloodGroup: "O+", available: 20, reserved: 5 },
  { bloodGroup: "O-", available: 10, reserved: 2 },
];

const AdminDashboard = ({ onActionSuccess }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleApprove = (id: string) => {
    // In a real app, this would make an API call to approve the request
    onActionSuccess(`Request ${id} approved`);
  };
  
  const handleReject = (id: string) => {
    // In a real app, this would make an API call to reject the request
    onActionSuccess(`Request ${id} rejected`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, requests, and blood banks from a central location
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donors"
          value="237"
          icon={<Users className="h-5 w-5 text-blood" />}
          description="Registered blood donors"
          trend="up"
          trendValue="+12 this week"
        />
        
        <StatCard
          title="Active Requests"
          value="18"
          icon={<Activity className="h-5 w-5 text-blood" />}
          description="Pending blood requests"
          trend="up"
          trendValue="+3 since yesterday"
        />
        
        <StatCard
          title="Blood Banks"
          value="12"
          icon={<Hospital className="h-5 w-5 text-blood" />}
          description="Operational blood banks"
        />
        
        <StatCard
          title="Total Donations"
          value="583"
          icon={<Droplet className="h-5 w-5 text-blood" />}
          description="Lifetime donations"
          trend="up"
          trendValue="+24 this month"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="requests">
        <TabsList className="mb-4">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Requests</span>
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="flex items-center gap-2">
            <Hospital className="h-4 w-4" />
            <span>Hospitals</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Blood Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Blood Requests</CardTitle>
                <CardDescription>Monitor and manage all blood donation requests</CardDescription>
              </div>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input 
                  placeholder="Search requests..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {request.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell>{request.units}</TableCell>
                      <TableCell>{request.hospital}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          request.urgency === "Critical" 
                            ? "bg-red-100 text-red-800" 
                            : request.urgency === "High" 
                            ? "bg-orange-100 text-orange-800" 
                            : request.urgency === "Medium" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {request.urgency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          request.status === "Pending" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {request.status === "Pending" && (
                            <>
                              <Button 
                                onClick={() => handleApprove(request.id)} 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                Approve
                              </Button>
                              <Button 
                                onClick={() => handleReject(request.id)} 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === "Fulfilled" && (
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Hospitals</CardTitle>
              <CardDescription>Manage hospitals and their blood banks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Hospital Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Blood Bank Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredHospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">{hospital.id}</TableCell>
                      <TableCell>{hospital.name}</TableCell>
                      <TableCell>{hospital.location}</TableCell>
                      <TableCell>{hospital.contactPerson}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          hospital.bloodBankStatus === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {hospital.bloodBankStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button className="btn-blood">Add New Hospital</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Inventory</CardTitle>
              <CardDescription>Current blood stock levels across all blood banks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {bloodInventory.map((item) => (
                  <Card key={item.bloodGroup} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-blood">{item.bloodGroup}</p>
                          <p className="text-sm text-muted-foreground">
                            Available: {item.available} units
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reserved: {item.reserved} units
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
                          <Droplet className="h-6 w-6 text-blood" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Inventory
                </Button>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Donation Drive
                </Button>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Donation Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Donation trend chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Blood Group Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Blood group pie chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-between">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <select id="report-type" className="p-2 border rounded-md">
                      <option value="monthly">Monthly Summary</option>
                      <option value="quarterly">Quarterly Report</option>
                      <option value="annual">Annual Statistics</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    <Button>Generate Report</Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, edit and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search users..." className="w-80" />
                  <Button variant="outline">
                    Search
                  </Button>
                </div>
                <div>
                  <Button className="btn-blood">
                    Add New User
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-6 flex items-center justify-center h-64">
                <p className="text-muted-foreground">User management interface would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
