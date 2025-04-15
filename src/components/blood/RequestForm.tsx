
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { AlertCircle } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: "low", label: "Low - Within a week" },
  { value: "medium", label: "Medium - Within 2-3 days" },
  { value: "high", label: "High - Within 24 hours" },
  { value: "critical", label: "Critical - Immediate need" },
];

const RequestForm = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    units: "1",
    urgency: "",
    hospital: "",
    location: "",
    contactName: "",
    contactPhone: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, submit the blood request
    console.log("Blood request submitted", formData);
  };

  return (
    <Card className="card-gradient shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Request Blood</CardTitle>
        <CardDescription>
          Fill out this form to request blood donation. We'll match you with potential donors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                For critical emergencies, please also contact your local hospital or blood bank directly 
                after submitting this request.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  placeholder="Full name of the patient"
                  required
                  value={formData.patientName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group Needed</Label>
                <Select 
                  onValueChange={handleSelectChange("bloodGroup")}
                  value={formData.bloodGroup}
                  required
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="units">Units Required</Label>
                <Input
                  id="units"
                  name="units"
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.units}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select 
                  onValueChange={handleSelectChange("urgency")}
                  value={formData.urgency}
                  required
                >
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Select Urgency Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital/Medical Center</Label>
                <Input
                  id="hospital"
                  name="hospital"
                  placeholder="Name of the hospital"
                  required
                  value={formData.hospital}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, State"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  placeholder="Name of the contact person"
                  required
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="+1 (234) 567-8901"
                  required
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information that might be helpful"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full btn-blood"
          onClick={(e) => handleSubmit(e as React.FormEvent)}
        >
          Submit Blood Request
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RequestForm;
