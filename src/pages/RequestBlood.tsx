
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import RequestForm from "@/components/blood/RequestForm";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";

const RequestBlood = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Request Blood Donation | Pulse of Life";
  }, []);
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please log in to request blood donations",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">Request Blood</h1>
          <p className="text-gray-500 mb-8 text-center">
            Fill out this form to request blood donation. We'll match you with potential donors.
          </p>
          
          <RequestForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestBlood;
