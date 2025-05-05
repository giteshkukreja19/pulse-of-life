
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, ResponsiveContainer, Cell
} from "recharts";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type definitions for data
interface BloodInventoryData {
  bloodGroup: string;
  units: number;
}

interface DonorStats {
  bloodGroup: string;
  count: number;
}

interface RequestStats {
  month: string;
  pending: number;
  completed: number;
}

interface HospitalStats {
  name: string;
  requests: number;
}

const Reports = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  
  // Colors for charts
  const BLOOD_GROUP_COLORS = {
    "A+": "#ef4444",
    "A-": "#f87171",
    "B+": "#dc2626",
    "B-": "#b91c1c",
    "AB+": "#991b1b",
    "AB-": "#7f1d1d",
    "O+": "#f43f5e",
    "O-": "#e11d48",
  };
  
  // Fetch blood requests data
  const { data: bloodRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["blood-requests-stats", period],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blood_requests')
          .select('*');
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching blood requests stats:", error);
        toast.error("Failed to load blood request statistics");
        return [];
      }
    },
  });
  
  // Fetch donors data
  const { data: donors = [], isLoading: isLoadingDonors } = useQuery({
    queryKey: ["donors-stats"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('donors')
          .select('*');
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching donors stats:", error);
        toast.error("Failed to load donor statistics");
        return [];
      }
    },
  });
  
  // Fetch hospitals data
  const { data: hospitals = [], isLoading: isLoadingHospitals } = useQuery({
    queryKey: ["hospitals-stats"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('hospitals')
          .select('*');
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching hospitals stats:", error);
        toast.error("Failed to load hospital statistics");
        return [];
      }
    },
  });
  
  // Process data for blood group distribution chart
  const donorsByBloodGroup: DonorStats[] = donors.reduce((acc: DonorStats[], donor) => {
    const existingGroup = acc.find(item => item.bloodGroup === donor.blood_group);
    
    if (existingGroup) {
      existingGroup.count += 1;
    } else {
      acc.push({ bloodGroup: donor.blood_group, count: 1 });
    }
    
    return acc;
  }, []);
  
  // Process data for request stats by month
  const requestsByMonth: RequestStats[] = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const monthlyData = months.map(month => {
      const monthRequests = bloodRequests.filter(req => {
        const requestDate = new Date(req.created_at);
        return months[requestDate.getMonth()] === month;
      });
      
      return {
        month,
        pending: monthRequests.filter(req => req.status === 'pending').length,
        completed: monthRequests.filter(req => req.status === 'approved' || req.status === 'completed').length
      };
    });
    
    return monthlyData;
  })();
  
  // Process hospital stats (number of requests per hospital)
  const hospitalStats: HospitalStats[] = (() => {
    const stats: Record<string, number> = {};
    
    bloodRequests.forEach(request => {
      if (!stats[request.hospital]) {
        stats[request.hospital] = 0;
      }
      stats[request.hospital] += 1;
    });
    
    return Object.keys(stats).map(name => ({
      name,
      requests: stats[name]
    })).sort((a, b) => b.requests - a.requests).slice(0, 5);
  })();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Track blood donation metrics and system performance
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{bloodRequests.length}</CardTitle>
              <CardDescription>Total Blood Requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {bloodRequests.filter(r => r.status === 'approved' || r.status === 'completed').length} fulfilled requests ({bloodRequests.length > 0 ? 
                  Math.round((bloodRequests.filter(r => r.status === 'approved' || r.status === 'completed').length / bloodRequests.length) * 100) : 0}%)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{donors.length}</CardTitle>
              <CardDescription>Registered Donors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Most common: {
                  donorsByBloodGroup.sort((a, b) => b.count - a.count)[0]?.bloodGroup || "N/A"
                }
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{hospitals.length}</CardTitle>
              <CardDescription>Registered Hospitals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {hospitals.filter(h => h.status === 'active').length} active hospitals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {bloodRequests.reduce((total, req) => total + req.units, 0)}
              </CardTitle>
              <CardDescription>Blood Units Requested</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Avg. {bloodRequests.length > 0 ? 
                  Math.round(bloodRequests.reduce((total, req) => total + req.units, 0) / bloodRequests.length) : 0
                } units per request
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donors">Donor Analytics</TabsTrigger>
            <TabsTrigger value="requests">Request Analytics</TabsTrigger>
            <TabsTrigger value="hospitals">Hospital Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Blood Group Distribution</CardTitle>
                  <CardDescription>
                    Registered donors by blood group
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoadingDonors ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donorsByBloodGroup}
                          dataKey="count"
                          nameKey="bloodGroup"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ bloodGroup }) => bloodGroup}
                        >
                          {donorsByBloodGroup.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={BLOOD_GROUP_COLORS[entry.bloodGroup as keyof typeof BLOOD_GROUP_COLORS] || "#ef4444"} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} donors`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Monthly Request Trends</CardTitle>
                  <CardDescription>
                    Blood request volumes over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoadingRequests ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={requestsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" name="Completed" fill="#10b981" />
                        <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Top Hospitals by Request Volume</CardTitle>
                  <CardDescription>
                    Hospitals with highest blood request counts
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoadingHospitals || isLoadingRequests ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical" 
                        data={hospitalStats}
                        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="requests" name="Blood Requests" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="donors">
            <Card>
              <CardHeader>
                <CardTitle>Donor Analytics Coming Soon</CardTitle>
                <CardDescription>
                  We're gathering more detailed donor metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Check back soon for detailed donor analytics and insights.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Request Analytics Coming Soon</CardTitle>
                <CardDescription>
                  We're gathering more detailed request metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Check back soon for detailed request analytics and insights.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hospitals">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Analytics Coming Soon</CardTitle>
                <CardDescription>
                  We're gathering more detailed hospital metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Check back soon for detailed hospital analytics and insights.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
