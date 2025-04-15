
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Filter, User, Phone, Mail } from "lucide-react";

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Mock donor data
const donors = [
  {
    id: 1,
    name: "John Doe",
    bloodGroup: "A+",
    location: "New York, NY",
    distance: "2.5",
    lastDonated: "45 days ago",
    donationCount: 7,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    bloodGroup: "O-",
    location: "Brooklyn, NY",
    distance: "3.2",
    lastDonated: "60 days ago",
    donationCount: 12,
  },
  {
    id: 3,
    name: "Michael Smith",
    bloodGroup: "B+",
    location: "Queens, NY",
    distance: "4.7",
    lastDonated: "90 days ago",
    donationCount: 5,
  },
  {
    id: 4,
    name: "Emily Davis",
    bloodGroup: "AB+",
    location: "Manhattan, NY",
    distance: "1.8",
    lastDonated: "120 days ago",
    donationCount: 3,
  },
  {
    id: 5,
    name: "David Wilson",
    bloodGroup: "A-",
    location: "Bronx, NY",
    distance: "5.3",
    lastDonated: "30 days ago",
    donationCount: 9,
  },
];

const FindDonors = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Find Blood Donors</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Search and Filter */}
          <Card className="mb-8 card-gradient shadow">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Search Donors</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Enter city, zip code"
                        className="pl-10"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select 
                      value={selectedBloodGroup}
                      onValueChange={setSelectedBloodGroup}
                    >
                      <SelectTrigger id="bloodGroup">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="btn-blood flex gap-2">
                    <Search className="h-4 w-4" />
                    Search Donors
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Donors</h2>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {donors.map((donor) => (
                <Card key={donor.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-1">
                        <div className="flex h-10 w-10 rounded-full bg-blood items-center justify-center">
                          <span className="text-white font-bold">{donor.bloodGroup}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-3">
                        <h3 className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {donor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {donor.location}
                        </p>
                      </div>
                      
                      <div className="col-span-3">
                        <p className="text-sm flex items-center gap-2">
                          <span className="font-medium">Distance:</span> {donor.distance} miles
                        </p>
                        <p className="text-sm flex items-center gap-2">
                          <span className="font-medium">Last donated:</span> {donor.lastDonated}
                        </p>
                      </div>
                      
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {donor.donationCount} donations
                          </div>
                          {donor.donationCount > 5 && (
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Frequent Donor
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="btn-blood">
                          Request
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FindDonors;
