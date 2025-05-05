
import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useHospitalProfile } from "@/hooks/useHospitals";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";

interface HospitalProfileProps {
  readOnly?: boolean;
}

const HospitalProfile = ({ readOnly = false }: HospitalProfileProps) => {
  const { userId } = useContext(AuthContext);
  const { data: hospitalProfile, isLoading, error, refetch } = useHospitalProfile(userId);
  
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  
  // Initialize form with hospital profile data when loaded
  useEffect(() => {
    if (hospitalProfile) {
      setName(hospitalProfile.name || "");
      setLocation(hospitalProfile.location || "");
      setContactPerson(hospitalProfile.contact_person || "");
      setPhone(hospitalProfile.phone || "");
      setEmail(hospitalProfile.email || "");
      setDescription(hospitalProfile.description || "");
    }
  }, [hospitalProfile]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!userId) {
        toast.error("You must be logged in to update your profile");
        return;
      }
      
      let updateData = {
        name,
        location,
        contact_person: contactPerson,
        phone,
        email,
        description
      };
      
      let result;
      
      // Update existing profile or create new one
      if (hospitalProfile) {
        const { data, error } = await supabase
          .from('hospitals')
          .update(updateData)
          .eq('id', hospitalProfile.id);
          
        if (error) throw error;
        result = data;
      } else {
        // Create new hospital profile
        const { data, error } = await supabase
          .from('hospitals')
          .insert({
            ...updateData,
            user_id: userId,
            status: 'active'
          });
          
        if (error) throw error;
        result = data;
      }
      
      toast.success("Hospital profile updated successfully");
      refetch(); // Refresh hospital data
    } catch (error) {
      console.error("Error updating hospital profile:", error);
      toast.error("Failed to update hospital profile");
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          Loading hospital profile...
        </CardContent>
      </Card>
    );
  }
  
  if (error && !readOnly) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-red-500">Error loading hospital profile</p>
          <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{readOnly ? "Hospital Profile" : "Update Hospital Profile"}</CardTitle>
        <CardDescription>
          {readOnly 
            ? "View your hospital information" 
            : "Update your hospital information and contact details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(!hospitalProfile && readOnly) ? (
          <div className="text-center py-4">
            <p>No hospital profile found.</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.href = '/profile'}
            >
              Create Hospital Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Hospital Name</label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-100" : ""}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input 
                  id="location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required 
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-100" : ""}
                  placeholder="City, State"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</label>
                <Input 
                  id="contactPerson" 
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required 
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-100" : ""}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-100" : ""}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-100" : ""}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100" : ""}
                placeholder="Brief description of your hospital..."
              />
            </div>
            
            {!readOnly && (
              <Button type="submit" className="w-full md:w-auto">
                {hospitalProfile ? "Update Profile" : "Create Hospital Profile"}
              </Button>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default HospitalProfile;
