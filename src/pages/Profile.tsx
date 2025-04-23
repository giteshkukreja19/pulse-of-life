import { useEffect, useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Heart,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";
import { toast } from "sonner";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Fetch current user's donor profile
  useEffect(() => {
    let subscription: any;
    let channel: any;
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setProfileData(null);
        return;
      }
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        setProfileData(null);
        setLoading(false);
        return;
      }
      setProfileData(data);
      setLoading(false);

      // Subscribe to real-time updates for this donor
      channel = supabase
        .channel("public:donors_profile")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "donors", filter: `user_id=eq.${user.id}` },
          (payload) => {
            // Fetch updated user data
            supabase
              .from("donors")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle()
              .then(({ data }) => setProfileData(data));
          }
        )
        .subscribe();
    };
    fetchProfile();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Save profile (updates database)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { id, ...upsertData } = profileData;
    const { error } = await supabase
      .from("donors")
      .update(upsertData)
      .eq("id", profileData.id);
    setSaving(false);
    if (!error) {
      toast.success("Profile updated!");
    } else {
      toast.error("Failed to update profile.");
    }
  };

  // GPS Location button: fill "location" field using browser geolocation
  const handleGPSClick = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      return;
    }
    toast.info("Fetching current location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use a public reverse geocoding API for demonstration
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const address = data.display_name || `${latitude}, ${longitude}`;
        setProfileData((prev: any) => ({
          ...prev,
          location: address,
        }));
        toast.success("Location detected and added!");
      },
      (err) => {
        toast.error("Geolocation failed.");
      }
    );
  };

  // Fixed: Properly typed the event parameter to access the checked property
  const handleLocationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationEnabled(e.target.checked);
    if (e.target.checked) {
      // Handle location toggle logic
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          <div className="text-center py-10">Loading profile...</div>
        </div>
      </MainLayout>
    );
  }

  if (!profileData) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          <div className="text-center py-10 text-destructive">
            Your profile is not available. Please register as a donor to view your profile.
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="donation" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Donation History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Availability</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name || ""}
                        onChange={(e) =>
                          setProfileData((prev: any) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email || ""}
                        readOnly // email shouldn't be editable
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone || ""}
                        onChange={(e) =>
                          setProfileData((prev: any) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        onValueChange={(value) =>
                          setProfileData((prev: any) => ({
                            ...prev,
                            blood_group: value,
                          }))
                        }
                        value={profileData.blood_group}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lastDonated">Last Donation Date</Label>
                      <Input
                        id="lastDonated"
                        name="last_donation"
                        type="date"
                        value={
                          profileData.last_donation
                            ? profileData.last_donation.slice(0, 10)
                            : ""
                        }
                        onChange={(e) =>
                          setProfileData((prev: any) => ({
                            ...prev,
                            last_donation: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location || ""}
                          onChange={(e) =>
                            setProfileData((prev: any) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          className="px-3"
                          variant="secondary"
                          title="Detect location"
                          onClick={handleGPSClick}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={profileData.zip || ""}
                      onChange={(e) =>
                        setProfileData((prev: any) => ({
                          ...prev,
                          zip: e.target.value,
                        }))
                      }
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button
                  className="btn-blood"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="donation">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>
                  Review your past donations and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blood/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blood" />
                        </div>
                        <div>
                          <h3 className="font-medium">January 15, 2025</h3>
                          <p className="text-sm text-muted-foreground">
                            Community Blood Drive
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          1 unit
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blood/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blood" />
                        </div>
                        <div>
                          <h3 className="font-medium">October 5, 2024</h3>
                          <p className="text-sm text-muted-foreground">
                            Red Cross Center
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          1 unit
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blood/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blood" />
                        </div>
                        <div>
                          <h3 className="font-medium">July 15, 2024</h3>
                          <p className="text-sm text-muted-foreground">
                            Memorial Hospital
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          1 unit
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <div className="bg-muted/30 p-5 rounded-lg text-center">
                      <h3 className="text-2xl font-bold text-blood">3</h3>
                      <p className="text-sm text-muted-foreground">Total Donations</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-lg text-center mx-4">
                      <h3 className="text-2xl font-bold text-blood">9</h3>
                      <p className="text-sm text-muted-foreground">Lives Impacted</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-lg text-center">
                      <h3 className="text-2xl font-bold text-blood">Silver</h3>
                      <p className="text-sm text-muted-foreground">Donor Rank</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      You will be eligible to donate again after May 15, 2025 (56 days from your last donation).
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="btn-blood flex gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Next Donation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Availability Settings</CardTitle>
                <CardDescription>
                  Manage your availability for blood donation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Donation Availability</h4>
                      <p className="text-sm text-muted-foreground">
                        Turn this on to be included in donation matches and requests
                      </p>
                    </div>
                    <Switch
                      checked={profileData.isAvailable}
                      onCheckedChange={(checked) =>
                        setProfileData((prev: any) => ({
                          ...prev,
                          isAvailable: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Preferences</h4>
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>Urgent donation requests</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Nearby blood drives</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>Email notifications</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>SMS notifications</span>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">Maximum Distance (miles)</Label>
                    <div className="grid grid-cols-4 gap-4">
                      <Select defaultValue="10">
                        <SelectTrigger id="radius">
                          <SelectValue placeholder="Select Distance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 miles</SelectItem>
                          <SelectItem value="10">10 miles</SelectItem>
                          <SelectItem value="25">25 miles</SelectItem>
                          <SelectItem value="50">50 miles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      You'll only be notified about requests within this distance from your location.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button className="btn-blood">Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
