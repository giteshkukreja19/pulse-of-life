
import { useEffect } from "react";
import HospitalRegisterForm from "@/components/auth/HospitalRegisterForm";
import MainLayout from "@/components/layout/MainLayout";

const RegisterHospital = () => {
  useEffect(() => {
    document.title = "Hospital Registration | Pulse of Life";
  }, []);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <HospitalRegisterForm />
      </div>
    </MainLayout>
  );
};

export default RegisterHospital;
