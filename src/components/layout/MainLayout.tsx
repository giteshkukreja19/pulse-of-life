
import { ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Check if the current page is a dashboard page
  const isDashboardPage = location.pathname === "/dashboard";
  
  // Apply a different container style for dashboard pages
  const containerClass = isDashboardPage 
    ? "flex-grow" 
    : "flex-grow";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {isAuthenticated && isDashboardPage && (
        <div className="bg-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {userRole && <span className="text-sm font-medium">Logged in as: <span className="capitalize">{userRole}</span></span>}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex gap-2 items-center"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
      <main className={containerClass}>
        {isDashboardPage ? (
          <div className="flex flex-col md:flex-row">
            {isAuthenticated && (userRole === "admin" || userRole === "hospital") && (
              <>
                <div className="hidden md:block">
                  <Sidebar userRole={userRole} />
                </div>
                <div className="block md:hidden">
                  <MobileSidebar userRole={userRole} />
                </div>
              </>
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
