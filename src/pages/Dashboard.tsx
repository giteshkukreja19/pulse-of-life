
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DonorDashboard from "@/components/dashboard/DonorDashboard";
import RecipientDashboard from "@/components/dashboard/RecipientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import { useToast } from "@/hooks/use-toast";

type UserRole = "donor" | "recipient" | "admin" | "hospital";

const Dashboard = () => {
  // In a real app, this would come from authentication
  const [userRole] = useState<UserRole>("admin");
  const { toast } = useToast();
  
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
          <DonorDashboard onActionSuccess={handleActionSuccess} />
        )}
        
        {userRole === "recipient" && (
          <RecipientDashboard onActionSuccess={handleActionSuccess} />
        )}
        
        {userRole === "admin" && (
          <AdminDashboard onActionSuccess={handleActionSuccess} />
        )}
        
        {userRole === "hospital" && (
          <HospitalDashboard onActionSuccess={handleActionSuccess} />
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
