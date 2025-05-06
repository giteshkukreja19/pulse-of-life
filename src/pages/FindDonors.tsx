
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
import { Search, MapPin, Filter, User, Droplet, Phone, Mail } from "lucide-react";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/App";

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const FindDonors = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [searchCity, setSearchCity] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");

  const {
    data: donors = [],
    isLoading,
    error,
  } = useDonors();

  // Filtering logic
  const filteredDonors = useMemo(() => {
    let result = donors || [];
    
    if (selectedBloodGroup !== "All") {
      result = result.filter(
        (donor) => donor.blood_group?.toUpperCase() === selectedBloodGroup
      );
    }
    
    if (searchCity.trim()) {
      const searchTerm = searchCity.toLowerCase().trim();
      result = result.filter((donor) =>
        donor.location?.toLowerCase().includes(searchTerm)
      );
    }
    
    return result;
  }, [donors, selectedBloodGroup, searchCity]);

  const handleRequestDonation = (donorId: string, donorName: string, bloodGroup: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to request blood donations");
      navigate("/login");
      return;
    }

    // Store donor information in session storage to pre-fill the request form
    sessionStorage.setItem("requestedDonorId", donorId);
    sessionStorage.setItem("requestedDonorName", donorName);
    sessionStorage.setItem("requestedBloodGroup", bloodGroup);
    
    navigate("/request");
    toast.success(`Creating a request for ${donorName} with ${bloodGroup} blood group`);
  };

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
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="Enter city name"
                        className="pl-10"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
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
                  {/* No manual search button needed, filtering is live */}
                  <div className="text-sm text-muted-foreground">
                    Results update in real-time as you type
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Donors</h2>
              <div className="text-sm text-muted-foreground">
                Found {filteredDonors.length} donors
              </div>
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
                      <TableHead>
                        <MapPin className="inline mr-1 h-4 w-4" /> City
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Last Donation</TableHead>
                      <TableHead>
                        <Mail className="inline mr-1 h-4 w-4" /> Contact
                      </TableHead>
                      <TableHead>
                        <Phone className="inline mr-1 h-4 w-4" /> Phone
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell className="font-medium">{donor.name}</TableCell>
                        <TableCell className="font-semibold text-blood">{donor.blood_group}</TableCell>
                        <TableCell>{donor.location}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {donor.last_donation
                            ? new Date(donor.last_donation).toLocaleDateString()
                            : <span className="text-xs text-muted-foreground">N/A</span>}
                        </TableCell>
                        <TableCell>
                          <a href={`mailto:${donor.email}`} className="text-primary underline flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">{donor.email}</span>
                            <span className="md:hidden">Email</span>
                          </a>
                        </TableCell>
                        <TableCell>
                          <a href={`tel:${donor.phone}`} className="text-primary underline flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">{donor.phone}</span>
                            <span className="md:hidden">Call</span>
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            className="btn-blood"
                            onClick={() => handleRequestDonation(donor.id, donor.name, donor.blood_group)}
                          >
                            Request
                          </Button>
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
