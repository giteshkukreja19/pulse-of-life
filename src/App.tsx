
import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "sonner";

// Import pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterHospital from "./pages/RegisterHospital";
import Dashboard from "./pages/Dashboard";
import RequestBlood from "./pages/RequestBlood";
import FindDonors from "./pages/FindDonors";
import Profile from "./pages/Profile";
import Hospitals from "./pages/admin/Hospitals";
import Donors from "./pages/admin/Donors";
import BloodRequests from "./pages/admin/BloodRequests";
import BloodInventory from "./pages/admin/BloodInventory";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalDonors from "./pages/hospital/HospitalDonors";
import ForgotPassword from "./pages/ForgotPassword";

// Define AuthContext
export const AuthContext = createContext({
  isAuthenticated: false,
  userId: null as string | null,
  userRole: null as string | null,
  authError: null as string | null,
  isLoading: false,
  login: async (email: string, password: string, role?: string): Promise<void> => {},
  logout: async (): Promise<void> => {},
  register: async (email: string, password: string, role: string): Promise<void> => {},
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    // Fix for Session issue - using async/await pattern
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        setIsAuthenticated(true);
        setUserId(data.session.user.id);
        getUserRole(data.session.user.id);
      }
    };
    
    checkSession();

    // Auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          getUserRole(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUserRole = async (userId: string) => {
    try {
      // First check if there's a role in the metadata
      const { data: userData } = await supabase.auth.getUser();
      const metadataRole = userData?.user?.user_metadata?.role;
      
      if (metadataRole) {
        setUserRole(metadataRole);
        return;
      }
      
      // If no role in metadata, check if user is a hospital
      const { data: hospitalData } = await supabase.from("hospitals").select("*").eq("user_id", userId).single();
  
      if (hospitalData) {
        setUserRole("hospital");
      } else {
        // If no hospital found, check if the user is an admin
        const { data: adminData, error: adminError } = await supabase.rpc('is_admin', { user_id: userId });
        if (adminError) {
          console.error("Error checking admin role:", adminError);
          setUserRole("donor");
          return;
        }
        if (adminData === true) {
          setUserRole("admin");
        } else {
          setUserRole("donor");
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("donor"); // Default to donor role
    }
  };

  const login = async (email: string, password: string, role?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        setIsAuthenticated(false);
        setUserId(null);
        setUserRole(null);
      } else {
        setAuthError(null);
        setIsAuthenticated(true);
        setUserId(data.user?.id);
        
        // Set role if provided during login
        if (role) {
          setUserRole(role);
          
          // Update user metadata with role
          await supabase.auth.updateUser({
            data: { role }
          });
        } else {
          getUserRole(data.user?.id || '');
        }
      }
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setUserId(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        setIsAuthenticated(false);
        setUserId(null);
        setUserRole(null);
      } else {
        setAuthError(null);
        setIsAuthenticated(true);
        setUserId(data.user?.id);
        setUserRole(role);
      }
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Registration error:", error);
      setIsAuthenticated(false);
      setUserId(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserId(null);
      setUserRole(null);
    } catch (error: any) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, userId, userRole, authError, isLoading, login, logout, register }}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-hospital" element={<RegisterHospital />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/help" element={<Help />} />
            <Route path="/hospital-profile" element={<HospitalProfile />} />
            <Route path="/find-donors" element={<FindDonors />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/request"
              element={
                isAuthenticated ? <RequestBlood /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? <Profile /> : <Navigate to="/login" />
              }
            />

            {/* Hospital Routes */}
            <Route 
              path="/hospital/donors"
              element={
                isAuthenticated && userRole === "hospital" ? (
                  <HospitalDonors />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/hospitals"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <Hospitals />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/donors"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <Donors />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/blood-requests"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <BloodRequests />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/blood-inventory"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <BloodInventory />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/reports"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <Reports />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/settings"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <Settings />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
