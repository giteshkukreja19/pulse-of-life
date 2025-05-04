
import { useEffect, useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Heart,
  Cake,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";
import { toast } from "sonner";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Fetch current user's profile
  useEffect(() => {
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

      // Try to fetch existing donor profile
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        toast.error("Error loading your profile");
        setLoading(false);
        return;
      }

      if (data) {
        setProfileData(data);
        setIsRegistered(true);
      } else {
        // Create a new profile object with default values
        setProfileData({
          user_id: user.id,
          name: "",
          email: user.email,
          phone: "",
          blood_group: "",
          location: "",
          age: "",
          isAvailable: true,
        });
        setIsRegistered(false);
      }
      
      setLoading(false);

      // Subscribe to real-time updates for this profile
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
              .then(({ data }) => {
                if (data) {
                  setProfileData(data);
                  setIsRegistered(true);
                }
              });
          }
        )
        .subscribe();
    };
    
    if (isAuthenticated) {
      fetchProfile();
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Save profile (updates database)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!profileData) {
        toast.error("No profile data to save");
        setSaving(false);
        return;
      }
      
      // If the profile is not registered yet (new user), create a new record
      if (!isRegistered) {
        const { error } = await supabase
          .from("donors")
          .insert({
            user_id: profileData.user_id,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            blood_group: profileData.blood_group,
            location: profileData.location,
            age: profileData.age,
            isAvailable: profileData.isAvailable,
          });

        if (error) {
          console.error("Error creating profile:", error);
          toast.error("Failed to create profile");
          setSaving(false);
          return;
        }

        toast.success("Profile created successfully!");
        setIsRegistered(true);
      } else {
        // Update existing profile
        const { id, user_id, created_at, ...updateData } = profileData;
        
        const { error } = await supabase
          .from("donors")
          .update(updateData)
          .eq("id", profileData.id);
          
        if (error) {
          console.error("Error updating profile:", error);
          toast.error("Failed to update profile");
          setSaving(false);
          return;
        }
        
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
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
        
        // Extract only city from the address
        const address = data.address?.city || 
                       data.address?.town || 
                       data.address?.village || 
                       data.address?.county ||
                       data.display_name.split(',')[0] || 
                       `${latitude}, ${longitude}`;
                       
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

  // Navigate to request blood page
  const handleRequestBlood = () => {
    window.location.href = "/request-blood";
  };
  
  // Field change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
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

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          <div className="text-center py-10 text-destructive">
            Your profile is not available. Please <a href="/login" className="underline font-semibold">login</a> or <a href="/register" className="underline font-semibold">register</a> to view your profile.
          </div>
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
            There was an error loading your profile. Please try again later.
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              {isRegistered 
                ? "Manage your personal information and blood donation preferences" 
                : "Complete your profile to become a registered donor"
              }
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
                    onChange={handleChange}
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
                    readOnly
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
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="18"
                    max="100"
                    value={profileData.age || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    onValueChange={(value) =>
                      setProfileData((prev: any) => ({
                        ...prev,
                        blood_group: value,
                      }))
                    }
                    value={profileData.blood_group || ""}
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
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">City</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter your city"
                    value={profileData.location || ""}
                    onChange={handleChange}
                    required
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

              <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Available to Donate</h4>
                  <p className="text-sm text-muted-foreground">
                    Turn this on if you're currently available to donate blood
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
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3 mt-2">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Keep your profile updated to help match you with blood donation requests in your area.
                  You can both donate blood and request blood donations based on your needs.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1 btn-blood"
                  disabled={saving}
                >
                  {saving ? "Saving..." : isRegistered ? "Save Profile" : "Create Profile"}
                </Button>
                
                <Button
                  type="button"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleRequestBlood}
                >
                  Request Blood
                </Button>
              </div>
            </form>
            
            {isRegistered && profileData.last_donation && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Recent Donation Activity</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blood/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-blood" />
                    </div>
                    <div>
                      <h3 className="font-medium">Last donated on {new Date(profileData.last_donation).toLocaleDateString()}</h3>
                      <p className="text-sm text-muted-foreground">
                        Thank you for your contribution
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
