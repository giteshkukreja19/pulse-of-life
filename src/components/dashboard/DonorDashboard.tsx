
import { useState } from "react";
import { Droplet, Calendar, Award, Clock, Heart, Bookmark, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

interface DonorDashboardProps {
  onActionSuccess: (action: string) => void;
}

const DonorDashboard = ({ onActionSuccess }: DonorDashboardProps) => {
  const [availability, setAvailability] = useState<"available" | "unavailable">("available");
  
  const handleScheduleDonation = () => {
    onActionSuccess("New donation appointment scheduled");
  };
  
  const toggleAvailability = () => {
    const newStatus = availability === "available" ? "unavailable" : "available";
    setAvailability(newStatus);
    onActionSuccess(`Availability status updated to ${newStatus}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Donor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome! Start your journey as a blood donor and help save lives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Your availability:</span>
          <Button 
            onClick={toggleAvailability}
            className={availability === "available" 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-400 hover:bg-gray-500 text-white"}
          >
            {availability === "available" ? "Available to Donate" : "Currently Unavailable"}
          </Button>
        </div>
      </div>
      
      {/* Eligibility Alert */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">You are eligible to donate</AlertTitle>
        <AlertDescription className="text-green-700">
          Schedule your first donation appointment now and start helping others.
        </AlertDescription>
      </Alert>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value="0"
          icon={<Droplet className="h-5 w-5 text-blood" />}
          description="Start your donation journey"
        />
        <StatCard
          title="Next Eligible Date"
          value="Now"
          icon={<Calendar className="h-5 w-5 text-blood" />}
          description="You can donate today"
        />
        <StatCard
          title="Lives Impacted"
          value="0"
          icon={<Heart className="h-5 w-5 text-blood" />}
          description="Each donation can save up to 3 lives"
        />
        <StatCard
          title="Donor Rank"
          value="New Donor"
          icon={<Award className="h-5 w-5 text-blood" />}
          description="Make your first donation"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="upcoming">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Upcoming</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span>Matching Requests</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Donations</CardTitle>
              <CardDescription>
                Schedule your first donation appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No Upcoming Donations</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any scheduled donations yet.
                </p>
                <Button className="btn-blood" onClick={handleScheduleDonation}>Schedule Donation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>
                Your blood donation journey starts here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No Donation History</h3>
                <p className="text-muted-foreground">
                  You haven't made any donations yet. Schedule your first donation to begin saving lives.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Donation Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">Total Volume</h4>
                        <p className="text-2xl font-bold text-blood">0 ml</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">This Year</h4>
                        <p className="text-2xl font-bold text-blood">0 donations</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">Donation Streak</h4>
                        <p className="text-2xl font-bold text-blood">0 consecutive</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Matching Blood Requests</CardTitle>
              <CardDescription>
                Find donation opportunities near you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search by location..." className="w-64" />
                  <Button variant="outline" size="sm">Search</Button>
                </div>
                <select className="p-2 border rounded-md">
                  <option value="5">Within 5 miles</option>
                  <option value="10">Within 10 miles</option>
                  <option value="15">Within 15 miles</option>
                  <option value="20">Within 20 miles</option>
                </select>
              </div>
              
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No matching requests found in your area at the moment.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check back later or expand your search radius.
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Want to see all available requests?
                </p>
                <Link to="/donors">
                  <Button variant="outline">Browse All Requests</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle>Health & Donation Tips</CardTitle>
          <CardDescription>
            Prepare for your first donation with these health tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Droplet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Stay Hydrated</h4>
                    <p className="text-sm text-muted-foreground">
                      Drink plenty of water before and after donation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Rest Well</h4>
                    <p className="text-sm text-muted-foreground">
                      Get a good night's sleep before donating blood.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Iron-Rich Foods</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintain iron levels with a healthy diet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDashboard;

