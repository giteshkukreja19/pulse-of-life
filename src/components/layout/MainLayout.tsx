
import { ReactNode, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [userRole] = useState<"donor" | "recipient" | "admin" | "hospital">("admin"); // This would come from auth context
  
  // Check if the current page is a dashboard page
  const isDashboardPage = location.pathname === "/dashboard";
  
  // Apply a different container style for dashboard pages
  const containerClass = isDashboardPage 
    ? "flex-grow" 
    : "flex-grow";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={containerClass}>
        {isDashboardPage ? (
          <div className="flex flex-col md:flex-row">
            {(userRole === "admin" || userRole === "hospital") && (
              <Sidebar userRole={userRole} />
            )}
            <div className="w-full">
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
