
import { useState, useEffect } from "react";
import { 
  Activity, Users, Hospital, Droplet, Calendar, 
  FileText, Settings, PieChart, UserCheck, Database,
  Search, Filter, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useBloodRequestsRealtime } from "@/hooks/useBloodRequestsRealtime";
import { useHospitals } from "@/hooks/useHospitals";
import { useDonors } from "@/hooks/useDonors";
import StatCard from "./StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import HospitalUsersTable from "./HospitalUsersTable";

interface AdminDashboardProps {
  onActionSuccess: (action: string) => void;
}

const AdminDashboard = ({ onActionSuccess }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: bloodRequests = [], isLoading: isLoadingRequests } = useBloodRequestsRealtime();
  const { data: hospitals = [], isLoading: isLoadingHospitals } = useHospitals();
  const { data: donors = [], isLoading: isLoadingDonors } = useDonors();
  const [requestRefreshTrigger, setRequestRefreshTrigger] = useState(0);

  // Force refresh data every 30 seconds as a fallback
  useEffect(() => {
    const interval = setInterval(() => {
      setRequestRefreshTrigger(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      onActionSuccess(`Request ${id} approved`);
      toast.success("Blood request approved successfully");
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      onActionSuccess(`Request ${id} rejected`);
      toast.success("Blood request rejected successfully");
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error("Failed to reject request");
    }
  };

  // Calculate dashboard stats
  const pendingRequests = bloodRequests.filter(req => req.status === 'pending');
  const activeHospitals = hospitals.filter(h => h.status === 'active');
  const totalDonors = donors?.length || 0;
  const approvedRequests = bloodRequests.filter(r => r.status === 'approved').length;
  const successRate = bloodRequests.length > 0 
    ? Math.round((approvedRequests / bloodRequests.length) * 100)
    : 0;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length.toString()}
          icon={<Activity className="h-5 w-5 text-blood" />}
          description="Active blood requests"
          trend={pendingRequests.length > 0 ? "up" : undefined}
          trendValue={pendingRequests.length > 0 ? "Needs attention" : undefined}
        />

        <StatCard
          title="Active Hospitals"
          value={activeHospitals.length.toString()}
          icon={<Hospital className="h-5 w-5 text-blood" />}
          description="Registered hospitals"
        />

        <StatCard
          title="Total Donors"
          value={totalDonors.toString()}
          icon={<Users className="h-5 w-5 text-blood" />}
          description="Registered donors"
        />

        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={<CheckCircle className="h-5 w-5 text-blood" />}
          description="Approved requests"
        />
      </div>

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
          <TabsTrigger value="donors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Donors</span>
          </TabsTrigger>
        </TabsList>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Blood Requests</CardTitle>
                <CardDescription>Monitor and manage all blood donation requests in real-time</CardDescription>
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
              {isLoadingRequests ? (
                <div className="text-center py-4">Loading requests...</div>
              ) : bloodRequests.length === 0 ? (
                <div className="text-center py-4">No blood requests found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bloodRequests
                      .filter(request => 
                        request.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        request.hospital.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.patient_name}</TableCell>
                          <TableCell>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {request.blood_group}
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
                          <TableCell>
                            <div className="flex space-x-2">
                              {request.status === "pending" && (
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hospitals Tab */}
        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Hospitals</CardTitle>
              <CardDescription>Manage hospitals and their blood banks</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHospitals ? (
                <div className="text-center py-4">Loading hospitals...</div>
              ) : hospitals.length === 0 ? (
                <div className="text-center py-4">No hospitals registered yet</div>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hospitals.map((hospital) => (
                      <TableRow key={hospital.id}>
                        <TableCell className="font-medium">{hospital.name}</TableCell>
                        <TableCell>{hospital.location}</TableCell>
                        <TableCell>{hospital.contact_person}</TableCell>
                        <TableCell>{hospital.phone}</TableCell>
                        <TableCell>{hospital.email}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            hospital.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {hospital.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>All Users (Donors and Recipients)</CardTitle>
              <CardDescription>See all registered users in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <HospitalUsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donors Tab */}
        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Donors</CardTitle>
              <CardDescription>View all blood donors in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDonors ? (
                <div className="text-center py-4">Loading donors...</div>
              ) : donors.length === 0 ? (
                <div className="text-center py-4">No donors registered yet</div>
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
                    {donors.map((donor) => (
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
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
