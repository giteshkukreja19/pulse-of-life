import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RequestBlood from "./pages/RequestBlood";
import FindDonors from "./pages/FindDonors";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import RegisterHospital from "./pages/RegisterHospital";
import { toast } from "sonner";

// Admin pages
import BloodInventory from "./pages/admin/BloodInventory";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import BloodRequests from "./pages/admin/BloodRequests";
import Donors from "./pages/admin/Donors";
import Hospitals from "./pages/admin/Hospitals";

export type UserRole = "donor" | "recipient" | "admin" | "hospital" | "both" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  authError: string | null;
  isLoading: boolean;
  userId: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole, metadata: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  authError: null,
  isLoading: false,
  userId: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, userRole } = useContext(AuthContext);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>;
  }
  
  if (!isAuthenticated || userRole !== "admin") {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const HospitalRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, userRole } = useContext(AuthContext);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>;
  }
  
  if (!isAuthenticated || (userRole !== "hospital" && userRole !== "admin")) {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      toast.error("Supabase connection test failed. Check your configuration.");
      return false;
    }
    
    console.log("Supabase connection successful!");
    return true;
  } catch (error) {
    console.error("Unexpected error in Supabase connection test:", error);
    toast.error("Unexpected error in Supabase connection test.");
    return false;
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    testSupabaseConnection();
  }, []);
  
  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      try {
        // First set up the auth listener to prevent missing auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "SIGNED_IN" && session) {
              setIsAuthenticated(true);
              setUserId(session.user.id);
              
              // Use setTimeout to prevent potential Supabase deadlocks
              setTimeout(async () => {
                try {
                  const { data: userData } = await supabase.auth.getUser();
                  if (userData?.user) {
                    const role = userData.user.user_metadata.role as UserRole;
                    setUserRole(role);
                  }
                } catch (error) {
                  console.error("Error getting user role:", error);
                }
              }, 0);
            } else if (event === "SIGNED_OUT") {
              setIsAuthenticated(false);
              setUserRole(null);
              setUserId(null);
            }
          }
        );

        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setAuthError(error.message);
          setIsAuthenticated(false);
          setUserRole(null);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          setIsAuthenticated(true);
          setUserId(data.session.user.id);
          
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const role = userData.user.user_metadata.role as UserRole;
            setUserRole(role);
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserId(null);
        }
      } catch (error) {
        console.error("Error in session check:", error);
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, []);
  
  const register = async (email: string, password: string, role: UserRole, metadata: any) => {
    setAuthError(null);
    
    try {
      if (!supabase) {
        const errMsg = "Supabase client is not initialized. Please check your configuration.";
        setAuthError(errMsg);
        toast.error(errMsg);
        return false;
      }

      const userMetadata = {
        ...metadata,
        role,
      };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
        },
      });
      
      if (error) {
        console.error("Registration error:", error);
        setAuthError(error.message);
        toast.error(error.message);
        return false;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        const errMsg = "This email is already registered. Please log in instead.";
        setAuthError(errMsg);
        toast.error(errMsg);
        return false;
      }
      
      toast.success("Registration successful! Please check your email for verification.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      const errMsg = "An unexpected error occurred";
      setAuthError(errMsg);
      toast.error(errMsg);
      return false;
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    setAuthError(null);
    
    try {
      if (!supabase) {
        const errMsg = "Supabase client is not initialized. Please check your configuration.";
        setAuthError(errMsg);
        toast.error(errMsg);
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        setAuthError(error.message);
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        setIsAuthenticated(true);
        
        const userRole = data.user.user_metadata?.role;
        setUserRole(userRole);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      const errMsg = "An unexpected error occurred during login";
      setAuthError(errMsg);
      toast.error(errMsg);
      return false;
    }
  };
  
  const logout = async () => {
    try {
      if (!supabase) {
        const errMsg = "Supabase client is not initialized. Please check your configuration.";
        setAuthError(errMsg);
        toast.error(errMsg);
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        setAuthError(error.message);
        toast.error(error.message);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
        toast.success("You've been logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
      const errMsg = "An unexpected error occurred during logout";
      setAuthError(errMsg);
      toast.error(errMsg);
    }
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthContext.Provider value={{
          isAuthenticated,
          userRole,
          authError,
          isLoading,
          userId,
          login,
          register,
          logout
        }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-hospital" element={<RegisterHospital />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/request" element={
                <ProtectedRoute>
                  <RequestBlood />
                </ProtectedRoute>
              } />
              <Route path="/donors" element={
                <ProtectedRoute>
                  <FindDonors />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/inventory" element={
                <AdminRoute>
                  <BloodInventory />
                </AdminRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              } />
              <Route path="/admin/requests" element={
                <AdminRoute>
                  <BloodRequests />
                </AdminRoute>
              } />
              <Route path="/admin/donors" element={
                <AdminRoute>
                  <Donors />
                </AdminRoute>
              } />
              <Route path="/admin/hospitals" element={
                <AdminRoute>
                  <Hospitals />
                </AdminRoute>
              } />
              
              {/* Hospital Routes */}
              <Route path="/hospital/inventory" element={
                <HospitalRoute>
                  <BloodInventory />
                </HospitalRoute>
              } />
              <Route path="/hospital/reports" element={
                <HospitalRoute>
                  <Reports />
                </HospitalRoute>
              } />
              <Route path="/hospital/requests" element={
                <HospitalRoute>
                  <BloodRequests />
                </HospitalRoute>
              } />
              <Route path="/hospital/donors" element={
                <HospitalRoute>
                  <Donors />
                </HospitalRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
