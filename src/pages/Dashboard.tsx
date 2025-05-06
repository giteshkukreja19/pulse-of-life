
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DonorDashboard from "@/components/dashboard/DonorDashboard";
import RecipientDashboard from "@/components/dashboard/RecipientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { useBloodRequestsRealtime } from "@/hooks/useBloodRequestsRealtime";
import MatchingRequestsPanel from "@/components/dashboard/MatchingRequestsPanel";
import { toast } from "sonner";

const Dashboard = () => {
  const { isAuthenticated, userRole, userId } = useContext(AuthContext);
  const { toast: uiToast } = useToast();
  const [userName, setUserName] = useState("");
  
  console.log("Dashboard - Auth Context:", { isAuthenticated, userRole, userId });
  
  // Get blood requests in real-time, based on user role
  const { data: bloodRequests = [], isLoading: isLoadingRequests } = useBloodRequestsRealtime(
    userRole === 'admin' ? undefined : { userId }
  );
  
  useEffect(() => {
    console.log(`Dashboard - Fetched ${bloodRequests.length} blood requests`);
  }, [bloodRequests]);
  
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get name from user metadata or use email as fallback
          const userDisplayName = user.user_metadata?.name || user.email?.split('@')[0] || "";
          setUserName(userDisplayName);
          console.log("Dashboard - Got user info:", { userDisplayName });
        }
      } catch (error) {
        console.error("Error getting user info:", error);
        toast.error("Failed to load user information");
      }
    };
    
    if (isAuthenticated) {
      getUserInfo();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    console.log("Dashboard - Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  const handleActionSuccess = (action: string) => {
    uiToast({
      title: "Success",
      description: `${action} completed successfully.`,
      variant: "default",
    });
  };

  console.log(`Dashboard - Rendering dashboard for role: ${userRole}`);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {userRole === "donor" && (
          <>
            <DonorDashboard 
              onActionSuccess={handleActionSuccess} 
              userName={userName} 
            />
            <div className="my-8 border-t border-gray-200"></div>
            <RecipientDashboard 
              onActionSuccess={handleActionSuccess} 
              bloodRequests={bloodRequests}
            />
            <div className="my-8 border-t border-gray-200"></div>
            <MatchingRequestsPanel />
          </>
        )}
        
        {userRole === "admin" && (
          <AdminDashboard onActionSuccess={handleActionSuccess} />
        )}
        
        {userRole === "hospital" && (
          <HospitalDashboard 
            onActionSuccess={handleActionSuccess} 
            userName={userName} 
          />
        )}
        
        {!userRole && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
            <p>Your user role could not be determined. Please log out and log in again.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
