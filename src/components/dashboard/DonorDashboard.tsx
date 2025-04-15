
import { Droplet, Calendar, Award, Clock, Heart, Bookmark, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "./StatCard";

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

const DonorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Donor Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back! Track your donations, check upcoming appointments, and see your impact.
      </p>
      
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
          value="May 1, 2025"
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donation.status === "confirmed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {donation.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      Schedule New Donation
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No Upcoming Donations</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any scheduled donations yet.
                    </p>
                    <Button className="btn-blood">Schedule Donation</Button>
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
                  <Button className="btn-blood">
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
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Urgent Request: A+ Blood</h4>
                      <p className="text-sm text-muted-foreground">
                        Memorial Hospital • 3.2 miles away
                      </p>
                      <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center mt-2">
                        Urgent: Needed within 24 hours
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button className="btn-blood" size="sm">Respond</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Regular Donation Needed: A+</h4>
                      <p className="text-sm text-muted-foreground">
                        City Blood Bank • 5.7 miles away
                      </p>
                      <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center mt-2">
                        Needed within a week
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button className="btn-blood" size="sm">Respond</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonorDashboard;
