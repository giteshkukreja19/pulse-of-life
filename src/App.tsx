
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
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
import { toast } from "sonner";

// Initialize Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create supabase client only if URL and key are available
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.error("Supabase configuration is missing. Please check your environment variables.");
}

// Create an authentication context
export type UserRole = "donor" | "recipient" | "admin" | "hospital" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  authError: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole, metadata: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  authError: null,
  isLoading: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

// Create a protected route component
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

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Show an error message if Supabase configuration is missing
  useEffect(() => {
    if (!supabase) {
      setAuthError("Missing Supabase configuration. Please set up your environment variables.");
      setIsLoading(false);
      toast.error("Missing Supabase configuration. Please set up your environment variables.");
    }
  }, []);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        // Skip session check if Supabase client isn't available
        if (!supabase) {
          setIsAuthenticated(false);
          setUserRole(null);
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setAuthError(error.message);
          setIsAuthenticated(false);
          setUserRole(null);
          return;
        }
        
        if (data.session) {
          setIsAuthenticated(true);
          
          // Get user role from metadata
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const role = userData.user.user_metadata.role as UserRole;
            setUserRole(role);
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error in session check:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (supabase) {
      checkSession();
      
      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            setIsAuthenticated(true);
            
            // Get user role from metadata
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
              const role = userData.user.user_metadata.role as UserRole;
              setUserRole(role);
            }
          } else if (event === "SIGNED_OUT") {
            setIsAuthenticated(false);
            setUserRole(null);
          }
        }
      );
      
      return () => {
        // Clean up auth listener
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    }
  }, []);
  
  // Authentication methods
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Check if Supabase client is available
      if (!supabase) {
        setAuthError("Supabase client is not initialized. Please check your configuration.");
        toast.error("Supabase client is not initialized. Please check your configuration.");
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        setAuthError(error.message);
        return false;
      }
      
      if (data.user) {
        setIsAuthenticated(true);
        
        // Verify user role matches what they're trying to log in as
        const userRole = data.user.user_metadata.role;
        
        if (userRole !== role) {
          setAuthError(`You're trying to log in as ${role}, but your account is registered as ${userRole}`);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setUserRole(null);
          return false;
        }
        
        setUserRole(role);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, role: UserRole, metadata: any) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Check if Supabase client is available
      if (!supabase) {
        setAuthError("Supabase client is not initialized. Please check your configuration.");
        toast.error("Supabase client is not initialized. Please check your configuration.");
        return false;
      }
      
      // Add role to user metadata
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
        return false;
      }
      
      // In most Supabase projects, email confirmation is required before login
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setAuthError("This email is already registered. Please log in instead.");
        return false;
      }
      
      // Add user profile data to profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id,
            name: metadata.name,
            email: email,
            role: role,
            phone: metadata.phone,
            blood_group: metadata.bloodGroup,
            age: metadata.age
          }]);
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          // The user is created but the profile failed to be created
          // In a production app, you'd want to handle this case better
        }
      }
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Check if Supabase client is available
      if (!supabase) {
        setAuthError("Supabase client is not initialized. Please check your configuration.");
        toast.error("Supabase client is not initialized. Please check your configuration.");
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        setAuthError(error.message);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
          login, 
          register,
          logout 
        }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <Navigate to="/login" replace />
              } />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
