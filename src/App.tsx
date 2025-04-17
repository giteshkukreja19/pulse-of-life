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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.error("Supabase configuration is missing. Please check your environment variables.");
}

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

const testSupabaseConnection = async (supabase: ReturnType<typeof createClient>) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      toast.error("Supabase connection test failed. Check your configuration.");
      return false;
    }
    
    console.log("Supabase connection successful!");
    toast.success("Supabase connection established successfully.");
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
  
  useEffect(() => {
    if (supabase) {
      testSupabaseConnection(supabase);
    } else {
      setAuthError("Missing Supabase configuration. Please set up your environment variables.");
      setIsLoading(false);
      toast.error("Missing Supabase configuration. Please set up your environment variables.");
    }
  }, []);
  
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
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
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            setIsAuthenticated(true);
            
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
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    }
  }, []);
  
  const register = async (email: string, password: string, role: UserRole, metadata: any) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      if (!supabase) {
        setAuthError("Supabase client is not initialized. Please check your configuration.");
        toast.error("Supabase client is not initialized. Please check your configuration.");
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
        return false;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setAuthError("This email is already registered. Please log in instead.");
        return false;
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

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
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
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        setIsAuthenticated(true);
        
        const userRole = data.user.user_metadata.role;
        
        if (userRole !== role) {
          const errorMsg = `You're trying to log in as ${role}, but your account is registered as ${userRole}`;
          setAuthError(errorMsg);
          toast.error(errorMsg);
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
      toast.error("An unexpected error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
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
