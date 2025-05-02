
import { useState, useContext, useEffect } from "react";
import { 
  Activity, Users, Calendar, Heart, Droplet, 
  Search, Filter, Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBloodRequestsRealtime } from "@/hooks/useBloodRequestsRealtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AuthContext } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface HospitalDashboardProps {
  onActionSuccess: (action: string) => void;
  userName: string;
}

const HospitalDashboard = ({ onActionSuccess, userName }: HospitalDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [donorSearchTerm, setDonorSearchTerm] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("5");
  const { userId } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get real-time blood requests for this hospital
  const { data: bloodRequests = [], isLoading: isLoadingRequests } = useBloodRequestsRealtime(
    { userId }
  );
  
  // Count requests by status
  const activeRequests = bloodRequests.filter(request => request.status === 'pending').length;
  
  // State for nearby donors
  const [nearbyDonors, setNearbyDonors] = useState([]);
  const [isLoadingDonors, setIsLoadingDonors] = useState(true);
  
  // Fetch nearby donors in real-time
  useEffect(() => {
    setIsLoadingDonors(true);
    
    // Setup real-time channel for donors
    const channel = supabase
      .channel("nearby-donors-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donors" },
        () => {
          fetchNearbyDonors();
        }
      )
      .subscribe((status) => {
        console.log("Nearby donors subscription status:", status);
      });
      
    // Initial fetch
    fetchNearbyDonors();
    
    return () => {
      console.log("Unsubscribing from donors real-time updates");
      supabase.removeChannel(channel);
    };
  }, [bloodTypeFilter, distanceFilter]);
  
  const fetchNearbyDonors = async () => {
    try {
      let query = supabase.from("donors").select("*");
      
      if (bloodTypeFilter) {
        query = query.eq("blood_group", bloodTypeFilter);
      }
      
      // In a real application, we would use geographic filtering
      // For now, we'll just fetch all donors
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setNearbyDonors(data || []);
      setIsLoadingDonors(false);
    } catch (error) {
      console.error("Error fetching nearby donors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby donors. Please try again.",
        variant: "destructive",
      });
      setIsLoadingDonors(false);
    }
  };
  
  const createRequest = () => {
    navigate("/request");
  };
  
  const filteredRequests = bloodRequests.filter(request =>
    request.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.urgency.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredDonors = nearbyDonors.filter(donor =>
    donor.name.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
    donor.blood_group.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
    donor.location.toLowerCase().includes(donorSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{userName ? userName + "'s Dashboard" : "Hospital Dashboard"}</h1>
      <p className="text-muted-foreground">
        Manage blood requests and inventory in real-time
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeRequests}</div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeRequests === 0 ? "No active requests" : 
                activeRequests === 1 ? "1 request pending" : 
                `${activeRequests} requests pending`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{nearbyDonors.length}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {nearbyDonors.length === 0 ? "No donors available" : 
                nearbyDonors.length === 1 ? "1 donor available" : 
                `${nearbyDonors.length} donors available`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{bloodRequests.filter(r => r.status === 'approved').length}</div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {bloodRequests.filter(r => r.status === 'approved').length === 0 ? "No scheduled donations" : 
                bloodRequests.filter(r => r.status === 'approved').length === 1 ? "1 scheduled donation" : 
                `${bloodRequests.filter(r => r.status === 'approved').length} scheduled donations`}
            </p>
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
                <CardTitle>Blood Requests</CardTitle>
                <CardDescription>Manage blood donation requests</CardDescription>
              </div>
              <Button className="btn-blood" onClick={createRequest}>Create New Request</Button>
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
              
              {isLoadingRequests ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading blood requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No blood requests found.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create a new request to get started.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.patient_name}</TableCell>
                        <TableCell>
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {request.blood_group}
                          </span>
                        </TableCell>
                        <TableCell>{request.units}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            request.urgency === "Critical" 
                              ? "bg-red-100 text-red-800" 
                              : request.urgency === "High" 
                              ? "bg-orange-100 text-orange-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {request.urgency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            request.status === "pending" 
                              ? "bg-blue-100 text-blue-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Donors</CardTitle>
              <CardDescription>Connect with donors in your region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search donors..." 
                    className="w-80" 
                    value={donorSearchTerm}
                    onChange={(e) => setDonorSearchTerm(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    className="p-2 border rounded-md" 
                    value={bloodTypeFilter}
                    onChange={(e) => setBloodTypeFilter(e.target.value)}
                  >
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
                  <select 
                    className="p-2 border rounded-md"
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(e.target.value)}
                  >
                    <option value="5">Within 5 miles</option>
                    <option value="10">Within 10 miles</option>
                    <option value="15">Within 15 miles</option>
                    <option value="20">Within 20 miles</option>
                  </select>
                </div>
              </div>
              
              {isLoadingDonors ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading donors...</p>
                </div>
              ) : filteredDonors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No donors found in your area.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try expanding your search radius or removing filters.
                  </p>
                </div>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonors.map((donor) => (
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
                        <TableCell>{donor.last_donation ? new Date(donor.last_donation).toLocaleString() : "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Inventory</CardTitle>
              <CardDescription>Current blood stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No inventory data available.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start by adding your current blood stock levels.
                </p>
                <Button className="btn-blood mt-4">Add Inventory</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalDashboard;
