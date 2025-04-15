
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DonorDashboard from "@/components/dashboard/DonorDashboard";

type UserRole = "donor" | "recipient" | "admin";

const Dashboard = () => {
  // In a real app, this would come from authentication
  const [userRole] = useState<UserRole>("donor");
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {userRole === "donor" ? (
          <DonorDashboard />
        ) : userRole === "recipient" ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Recipient Dashboard</h1>
            <p className="text-gray-500">
              View and manage your blood requests
            </p>
            {/* Recipient dashboard content would go here */}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Manage users, requests, and blood banks
            </p>
            {/* Admin dashboard content would go here */}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
