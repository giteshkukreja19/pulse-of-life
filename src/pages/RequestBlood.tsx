
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

const RequestBlood = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = "Request Blood Donation | Pulse of Life";
    
    // Fetch user profile data
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from("donors")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error fetching profile",
            description: "Could not load your profile information",
            variant: "destructive",
          });
          return;
        }
        
        setProfileData(data);
      } catch (err) {
        console.error("Error in profile fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId, toast]);
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please log in to request blood donations",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }
  
  const handleRequestClick = () => {
    if (!profileData) {
      toast({
        title: "Profile information missing",
        description: "Please complete your profile before requesting blood",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }
    
    setShowConfirm(true);
  };
  
  const handleConfirmRequest = async () => {
    if (!profileData) return;
    
    setSubmitting(true);
    try {
      // Create blood request with profile data
      const { error } = await supabase.from("blood_requests").insert({
        patient_name: profileData.name || "Patient",
        blood_group: profileData.blood_group,
        units: 1, // Default to 1 unit
        urgency: "medium", // Default urgency
        hospital: "Not specified",
        location: profileData.location || "Not specified",
        contact_name: profileData.name || "Contact person",
        contact_phone: profileData.phone || "Not provided",
        notes: "Request submitted from profile",
        user_id: userId,
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast({
        title: "Request submitted",
        description: "Your blood request has been submitted successfully",
      });
      
      // Redirect to dashboard or home page
      navigate("/");
    } catch (error: any) {
      console.error("Error submitting blood request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit blood request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">Request Blood</h1>
          <p className="text-gray-500 mb-8 text-center">
            Request blood donation using your profile information
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 text-navy animate-spin" />
              <span className="ml-2">Loading your profile...</span>
            </div>
          ) : !profileData ? (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile First</CardTitle>
                <CardDescription>
                  You need to complete your profile before requesting blood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3 mb-6">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Please go to your profile page and complete your information including blood group,
                    contact details and location.
                  </p>
                </div>
                
                <Button 
                  onClick={() => navigate("/profile")} 
                  className="w-full bg-navy hover:bg-navy/90"
                >
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Request Details</CardTitle>
                <CardDescription>
                  The following information from your profile will be used for your blood request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{profileData.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Blood Group</p>
                      <p className="font-semibold">{profileData.blood_group}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{profileData.location || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold">{profileData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3 mt-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      Your request will be visible to potential donors in your area.
                      For critical emergencies, please also contact your local hospital or blood bank directly.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleRequestClick}
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Blood Request"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Blood Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to submit this blood request? This will notify potential donors in your area.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleConfirmRequest}
                  disabled={submitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Yes, Request Blood"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestBlood;
