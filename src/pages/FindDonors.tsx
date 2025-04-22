
import { useState, useMemo } from "react";
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
import { Search, MapPin, Filter, User, Droplet } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { useDonors } from "@/hooks/useDonors";

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const FindDonors = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");

  const {
    data: donors = [],
    isLoading,
    error,
  } = useDonors();

  // Filtering logic
  const filteredDonors = useMemo(() => {
    let result = donors;
    if (selectedBloodGroup !== "All") {
      result = result.filter(
        (donor) => donor.blood_group?.toUpperCase() === selectedBloodGroup
      );
    }
    if (searchLocation.trim()) {
      result = result.filter((donor) =>
        donor.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    return result;
  }, [donors, selectedBloodGroup, searchLocation]);

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
                  {/* No manual search needed, filtering is live */}
                  <Button className="btn-blood flex gap-2" disabled>
                    <Search className="h-4 w-4" />
                    Real-Time Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Donors</h2>
              <Button variant="outline" size="sm" className="flex gap-2" disabled>
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
            
            <div className="relative mt-2 overflow-x-auto rounded-lg border border-muted shadow-sm bg-white">
              {isLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading donors...</div>
              ) : error ? (
                <div className="py-12 text-center text-destructive">Error fetching donors.</div>
              ) : filteredDonors.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No donors found matching your criteria. Try adjusting your search filters.
                </div>
              ) : (
                <Table>
                  <TableCaption>
                    Donors are displayed in real-time from the Supabase database.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <User className="inline mr-1 h-4 w-4" /> Name
                      </TableHead>
                      <TableHead>
                        <Droplet className="inline mr-1 h-4 w-4" /> Blood Group
                      </TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="hidden md:table-cell">Last Donation</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>{donor.name}</TableCell>
                        <TableCell>{donor.blood_group}</TableCell>
                        <TableCell>{donor.location}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {donor.last_donation
                            ? new Date(donor.last_donation).toLocaleDateString()
                            : <span className="text-xs text-muted-foreground">N/A</span>}
                        </TableCell>
                        <TableCell>
                          <a href={`mailto:${donor.email}`} className="text-primary underline">
                            {donor.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a href={`tel:${donor.phone}`} className="text-primary underline">
                            {donor.phone}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FindDonors;
