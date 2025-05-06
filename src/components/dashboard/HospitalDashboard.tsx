
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, UserRound, Droplet, CalendarRange, PieChart, List, Phone, Users, BadgePlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "./StatCard";
import { toast } from "sonner";

interface HospitalDashboardProps {
  onActionSuccess: (action: string) => void;
  userName: string;
}

const HospitalDashboard = ({ onActionSuccess, userName }: HospitalDashboardProps) => {
  const navigate = useNavigate();
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch blood requests
        const { data: requests, error: requestsError } = await supabase
          .from("blood_requests")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (requestsError) throw requestsError;
        setBloodRequests(requests || []);
        
        // Fetch inventory (placeholder data since we don't have real inventory yet)
        setInventory([
          { blood_group: "A+", units: 15 },
          { blood_group: "O+", units: 23 },
          { blood_group: "B+", units: 12 },
          { blood_group: "AB+", units: 5 },
          { blood_group: "A-", units: 8 },
          { blood_group: "O-", units: 10 },
          { blood_group: "B-", units: 6 },
          { blood_group: "AB-", units: 3 }
        ]);
      } catch (error) {
        console.error("Error fetching hospital dashboard data:", error);
        toast.error("Could not load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{userName ? userName + "'s Hospital Dashboard" : "Hospital Dashboard"}</h1>
          <p className="text-muted-foreground">
            Manage blood inventory, requests and donors
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => handleNavigate("/hospital-profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Building className="h-4 w-4 mr-2" /> Manage Profile
          </Button>
          <Button 
            onClick={() => handleNavigate("/hospital/donors")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Users className="h-4 w-4 mr-2" /> View Donors
          </Button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Blood Inventory"
          value={inventory.reduce((sum, item) => sum + item.units, 0) + " units"}
          icon={<Droplet className="h-5 w-5 text-blood" />}
          description="Total blood units available"
        />
        <StatCard
          title="Active Requests"
          value={bloodRequests.filter(req => req.status === 'pending').length.toString()}
          icon={<List className="h-5 w-5 text-blood" />}
          description="Pending blood requests"
        />
        <StatCard
          title="Donors Available"
          value="24"
          icon={<UserRound className="h-5 w-5 text-blood" />}
          description="Donors ready to help"
        />
        <StatCard
          title="This Month"
          value="62 units"
          icon={<CalendarRange className="h-5 w-5 text-blood" />}
          description="Blood collected in May"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            <span>Blood Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Blood Requests</span>
          </TabsTrigger>
          <TabsTrigger value="donors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Nearby Donors</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Blood Inventory</span>
                <Button size="sm" onClick={() => onActionSuccess("Blood inventory updated")}>
                  <BadgePlus className="h-4 w-4 mr-1" /> Add Units
                </Button>
              </CardTitle>
              <CardDescription>
                Current blood supply inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading inventory data...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {inventory.map((item) => (
                    <Card key={item.blood_group} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="bg-gradient-to-br from-red-50 to-white p-4 flex flex-col items-center">
                          <div className="text-4xl font-bold text-blood">{item.blood_group}</div>
                          <div className="mt-2 text-lg">{item.units} units</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.units < 10 ? "Low stock" : "Sufficient"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <Button onClick={() => handleNavigate("/hospital-profile?tab=inventory")}>
                  Manage Inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blood Requests</CardTitle>
              <CardDescription>
                Latest blood donation requests received
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading blood requests...</div>
              ) : bloodRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No blood requests found.</p>
                  <Button onClick={() => handleNavigate("/request")}>
                    Create Blood Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bloodRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden">
                      <div className="p-4 border-l-4 border-blood flex justify-between items-center">
                        <div>
                          <h3 className="font-medium flex items-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                              request.blood_group.includes("-") ? "bg-red-100 text-red-800" : "bg-red-200 text-red-800"
                            }`}>
                              {request.blood_group}
                            </span>
                            {request.patient_name} 
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                              {request.urgency === "urgent" ? 
                                <span className="text-red-600 font-semibold">URGENT</span> : 
                                request.urgency}
                            </span>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.units} units needed · Requested on {formatDate(request.created_at)}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center">
                              <Phone className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              {request.contact_phone}
                            </span>
                            <span className="flex items-center">
                              <Building className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              {request.hospital}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Button 
                            size="sm" 
                            variant={request.status === "pending" ? "default" : "outline"}
                            onClick={() => onActionSuccess("Request status updated")}
                          >
                            {request.status === "pending" ? "Fulfill Request" : "View Details"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => handleNavigate("/request")}>View All Requests</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donors">
          <Card>
            <CardHeader>
              <CardTitle>Available Donors</CardTitle>
              <CardDescription>
                Blood donors near your hospital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={() => handleNavigate("/hospital/donors")} 
                  className="btn-blood"
                >
                  <Users className="h-4 w-4 mr-2" /> View All Donors
                </Button>
              </div>
              
              <Alert className="mb-4">
                <AlertTitle>Want to see more donors?</AlertTitle>
                <AlertDescription>
                  Connect with more donors by participating in our community blood drives and using our donor outreach features.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-8">
                <Button onClick={() => handleNavigate("/hospital/donors")}>
                  Browse Donor Directory
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Blood Donation Campaign</CardTitle>
            <CardDescription>
              Organize blood donation drives at your hospital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Increase your blood inventory by organizing donation campaigns. 
                Our system helps you schedule, promote, and manage blood donation 
                drives efficiently.
              </p>
              <Button className="w-full" onClick={() => onActionSuccess("Campaign feature accessed")}>
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
            <CardDescription>
              Get insights into your blood bank operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Detailed analytics about blood inventory, requests, and donor statistics
                are available in the reports section.
              </p>
              <Button variant="outline" className="w-full" onClick={() => onActionSuccess("Reports feature accessed")}>
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalDashboard;
