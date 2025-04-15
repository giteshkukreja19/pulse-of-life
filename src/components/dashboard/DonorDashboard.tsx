
import { useState } from "react";
import { Droplet, Calendar, Award, Clock, Heart, Bookmark, User, CheckCircle, AlertTriangle } from "lucide-react";
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

// Mock data
const upcomingDonations = [
  {
    id: 1,
    date: "May 15, 2025",
    location: "Central Blood Bank",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    date: "June 20, 2025",
    location: "University Medical Center",
    time: "2:30 PM",
    status: "pending",
  },
];

const donationHistory = [
  {
    id: 1,
    date: "January 10, 2025",
    location: "Community Drive",
    type: "Whole Blood",
    units: "1",
  },
  {
    id: 2,
    date: "October 5, 2024",
    location: "Red Cross Center",
    type: "Whole Blood",
    units: "1",
  },
  {
    id: 3,
    date: "July 15, 2024",
    location: "Memorial Hospital",
    type: "Whole Blood",
    units: "1",
  },
];

const matchingRequests = [
  {
    id: "REQ-008",
    hospital: "Memorial Hospital",
    distance: "3.2 miles",
    bloodType: "A+",
    urgency: "Urgent",
    postedDate: "2025-04-13",
    neededBy: "2025-04-15",
  },
  {
    id: "REQ-009",
    hospital: "City Blood Bank",
    distance: "5.7 miles",
    bloodType: "A+",
    urgency: "Regular",
    postedDate: "2025-04-10",
    neededBy: "2025-04-20",
  },
];

const DonorDashboard = ({ onActionSuccess }: DonorDashboardProps) => {
  const [availability, setAvailability] = useState<"available" | "unavailable">("available");
  
  const handleScheduleDonation = () => {
    onActionSuccess("New donation appointment scheduled");
  };
  
  const handleRespondToRequest = (requestId: string) => {
    onActionSuccess(`Responded to request ${requestId}`);
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
            Welcome back! Track your donations, check upcoming appointments, and see your impact.
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
          Your last donation was over 56 days ago. You can schedule your next donation now.
        </AlertDescription>
      </Alert>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value="3"
          icon={<Droplet className="h-5 w-5 text-blood" />}
          description="Lifetime donations"
          trend="up"
          trendValue="+1 since last month"
        />
        <StatCard
          title="Next Eligible Date"
          value="Now"
          icon={<Calendar className="h-5 w-5 text-blood" />}
          description="56 days since last donation"
        />
        <StatCard
          title="Lives Impacted"
          value="9"
          icon={<Heart className="h-5 w-5 text-blood" />}
          description="Each donation saves up to 3 lives"
        />
        <StatCard
          title="Donor Rank"
          value="Silver"
          icon={<Award className="h-5 w-5 text-blood" />}
          description="5 more donations to Gold"
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
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Donations</CardTitle>
                <CardDescription>
                  Your scheduled donations and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingDonations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="bg-blood/10 p-2 rounded-full">
                            <Calendar className="h-5 w-5 text-blood" />
                          </div>
                          <div>
                            <h4 className="font-medium">{donation.location}</h4>
                            <p className="text-sm text-muted-foreground">
                              {donation.date} at {donation.time}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge className={donation.status === "confirmed" 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"}>
                            {donation.status === "confirmed" ? "Confirmed" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2" onClick={handleScheduleDonation}>
                      Schedule New Donation
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No Upcoming Donations</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any scheduled donations yet.
                    </p>
                    <Button className="btn-blood" onClick={handleScheduleDonation}>Schedule Donation</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Donation Eligibility</CardTitle>
                <CardDescription>
                  Your current eligibility status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Droplet className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">You are eligible to donate</h4>
                      <p className="text-sm text-muted-foreground">
                        Last donation was over 56 days ago
                      </p>
                    </div>
                  </div>
                  <Button className="btn-blood" onClick={handleScheduleDonation}>
                    Donate Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>
                A record of all your past donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationHistory.map((donation) => (
                  <div key={donation.id} className="grid grid-cols-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="col-span-1">
                      <p className="font-medium">{donation.date}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm">{donation.type}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm">{donation.units} unit</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm text-muted-foreground">{donation.location}</p>
                    </div>
                  </div>
                ))}
                
                {donationHistory.length === 0 && (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No Donation History</h3>
                    <p className="text-muted-foreground">
                      You haven't made any donations yet.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Donation Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">Total Volume</h4>
                        <p className="text-2xl font-bold text-blood">1500 ml</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">This Year</h4>
                        <p className="text-2xl font-bold text-blood">2 donations</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">Donation Streak</h4>
                        <p className="text-2xl font-bold text-blood">3 consecutive</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Download Donation Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Matching Blood Requests</CardTitle>
              <CardDescription>
                People who need your blood type (A+)
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
              
              <div className="space-y-4">
                {matchingRequests.map((request) => (
                  <Card key={request.id} className={request.urgency === "Urgent" ? "border-red-200 bg-red-50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{request.hospital}</h3>
                            <span className="text-sm text-muted-foreground">• {request.distance}</span>
                            {request.urgency === "Urgent" && (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Blood Type:</span>{" "}
                              <span className="font-medium text-blood">{request.bloodType}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Posted:</span>{" "}
                              <span>{request.postedDate}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Needed By:</span>{" "}
                              <span>{request.neededBy}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">ID:</span>{" "}
                              <span className="font-mono text-xs">{request.id}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Details</Button>
                          <Button 
                            onClick={() => handleRespondToRequest(request.id)}
                            className="btn-blood" 
                            size="sm"
                          >
                            Respond
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Can't find matching requests in your area?
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
            Prepare for your next donation with these health tips
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
                    <User className="h-5 w-5 text-green-600" />
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
