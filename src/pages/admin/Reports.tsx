
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { FileText, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";

interface ReportData {
  name: string;
  value: number;
  color: string;
}

const Reports = () => {
  const [timeFrame, setTimeFrame] = useState("month");

  // Mock data for blood donation by blood group
  const bloodGroupData: ReportData[] = [
    { name: "A+", value: 142, color: "#ef4444" },
    { name: "A-", value: 32, color: "#f87171" },
    { name: "B+", value: 98, color: "#dc2626" },
    { name: "B-", value: 27, color: "#b91c1c" },
    { name: "AB+", value: 21, color: "#991b1b" },
    { name: "AB-", value: 8, color: "#7f1d1d" },
    { name: "O+", value: 185, color: "#f43f5e" },
    { name: "O-", value: 45, color: "#e11d48" },
  ];

  // Mock data for donation statistics by month
  const monthlyStats = [
    { name: "Jan", donations: 65, requests: 45, fulfilled: 42 },
    { name: "Feb", donations: 59, requests: 50, fulfilled: 48 },
    { name: "Mar", donations: 80, requests: 72, fulfilled: 65 },
    { name: "Apr", donations: 81, requests: 90, fulfilled: 78 },
    { name: "May", donations: 56, requests: 49, fulfilled: 45 },
    { name: "Jun", donations: 55, requests: 60, fulfilled: 52 },
    { name: "Jul", donations: 40, requests: 35, fulfilled: 32 },
    { name: "Aug", donations: 73, requests: 69, fulfilled: 65 },
    { name: "Sep", donations: 82, requests: 75, fulfilled: 71 },
    { name: "Oct", donations: 92, requests: 85, fulfilled: 80 },
    { name: "Nov", donations: 110, requests: 95, fulfilled: 90 },
    { name: "Dec", donations: 120, requests: 105, fulfilled: 98 },
  ];

  // Mock data for hospital requests
  const hospitalStats = [
    { name: "City General", requests: 120, fulfilled: 105 },
    { name: "Memorial", requests: 95, fulfilled: 85 },
    { name: "St. Joseph's", requests: 85, fulfilled: 78 },
    { name: "University", requests: 72, fulfilled: 65 },
    { name: "Children's", requests: 65, fulfilled: 60 },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleExportReport = (reportType: string) => {
    // This would be implemented to generate a CSV or PDF report
    console.log(`Exporting ${reportType} report`);
    // For demo purposes, we'll just show a notification
    alert(`${reportType} report downloaded successfully!`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Analyze donation trends, requests, and operational metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export All</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Blood Group Distribution</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleExportReport("Blood Group Distribution")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>Distribution of blood donations by blood type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bloodGroupData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bloodGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Monthly Activity</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleExportReport("Monthly Activity")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>Donations and requests over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={monthlyStats}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="donations" stroke="#ef4444" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="requests" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="fulfilled" stroke="#10b981" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Hospital Request Fulfillment</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleExportReport("Hospital Request Fulfillment")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>Request fulfillment rate by hospital</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={hospitalStats}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="requests" fill="#3b82f6" name="Total Requests" />
                      <Bar dataKey="fulfilled" fill="#10b981" name="Fulfilled" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Critical metrics for blood bank performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Request Fulfillment Rate</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Donor Return Rate</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Blood Utilization Rate</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O- Inventory Level</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Placeholder for other tabs */}
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Donation Reports</CardTitle>
                <CardDescription>Detailed reports on blood donations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed donation analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Request Reports</CardTitle>
                <CardDescription>Detailed reports on blood requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed request analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hospitals">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Reports</CardTitle>
                <CardDescription>Detailed reports on hospital performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Hospital analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
