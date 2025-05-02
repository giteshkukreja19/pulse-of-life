
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

const Dashboard = () => {
  const { isAuthenticated, userRole, userId } = useContext(AuthContext);
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  
  // Get blood requests in real-time, filtered by user role
  const { data: bloodRequests = [] } = useBloodRequestsRealtime(
    userRole === 'admin' ? undefined : { userId }
  );
  
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get name from user metadata or use email as fallback
        const userDisplayName = user.user_metadata?.name || user.email || "";
        setUserName(userDisplayName);
      }
    };
    
    if (isAuthenticated) {
      getUserInfo();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleActionSuccess = (action: string) => {
    toast({
      title: "Success",
      description: `${action} completed successfully.`,
      variant: "default",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {userRole === "donor" && (
          <DonorDashboard 
            onActionSuccess={handleActionSuccess} 
            userName={userName} 
          />
        )}
        
        {userRole === "recipient" && (
          <RecipientDashboard 
            onActionSuccess={handleActionSuccess} 
            bloodRequests={bloodRequests}
          />
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
