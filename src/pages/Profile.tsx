
import { useState } from "react";
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
import { User, MapPin, Phone, Mail, Calendar, AlertCircle, Heart, Clock } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (234) 567-8901",
    bloodGroup: "A+",
    age: "28",
    address: "123 Main St, New York, NY 10001",
    lastDonated: "2025-01-15",
    medicalNotes: "",
    isAvailable: true,
    emergencyContact: "Jane Doe - +1 (234) 567-8902",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProfileData((prev) => ({ ...prev, isAvailable: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, submit profile changes to the backend
    console.log("Profile updated", profileData);
  };

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
                        value={profileData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        onValueChange={handleSelectChange("bloodGroup")}
                        value={profileData.bloodGroup}
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
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="18"
                        max="65"
                        value={profileData.age}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastDonated">Last Donation Date</Label>
                      <Input
                        id="lastDonated"
                        name="lastDonated"
                        type="date"
                        value={profileData.lastDonated}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Name - Phone Number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalNotes">Medical Notes (Private)</Label>
                    <Textarea
                      id="medicalNotes"
                      name="medicalNotes"
                      value={profileData.medicalNotes}
                      onChange={handleInputChange}
                      placeholder="Any medical conditions or notes you'd like to keep on record"
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button
                  className="btn-blood"
                  onClick={(e) => handleSubmit(e as React.FormEvent)}
                >
                  Save Changes
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
                      onCheckedChange={handleSwitchChange}
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
