
import { useEffect, useContext } from "react";
import HospitalRegisterForm from "@/components/auth/HospitalRegisterForm";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";
import { Navigate } from "react-router-dom";

const RegisterHospital = () => {
  const { isAuthenticated, authError } = useContext(AuthContext);
  
  useEffect(() => {
    document.title = "Hospital Registration | Pulse of Life";
  }, []);
  
  // Redirect already authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <HospitalRegisterForm />
      </div>
    </MainLayout>
  );
};

export default RegisterHospital;
