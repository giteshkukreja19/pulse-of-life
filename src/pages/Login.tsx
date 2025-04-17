
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { isAuthenticated, authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [adminAccountChecked, setAdminAccountChecked] = useState(false);
  
  useEffect(() => {
    document.title = "Login | Pulse of Life";
  }, []);
  
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);
  
  // Check if admin account exists and create it if not
  useEffect(() => {
    const checkAdminAccount = async () => {
      try {
        // Try to sign in with admin credentials as a test
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@pulseoflife.com',
          password: 'pulseoflife'
        });
        
        if (error) {
          console.log('Admin login test failed:', error.message);
          
          // If admin account doesn't exist, create it
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'admin@pulseoflife.com',
            password: 'pulseoflife',
            options: {
              data: {
                role: 'admin',
                name: 'System Admin'
              }
            }
          });
          
          if (signUpError) {
            console.error('Error creating admin account:', signUpError);
            toast.error('Error creating admin account: ' + signUpError.message);
          } else {
            console.log('Admin account created successfully');
            toast.success('Admin account created. You can now log in as admin.');
          }
        } else if (data.user) {
          // Admin account exists, sign out to allow regular login
          console.log('Admin account exists and credentials are valid');
          await supabase.auth.signOut();
          toast.success('Admin account verified. You can now log in.');
        }
        
        setAdminAccountChecked(true);
      } catch (error) {
        console.error('Unexpected error checking admin account:', error);
        setAdminAccountChecked(true);
      }
    };
    
    if (!adminAccountChecked && !isAuthenticated) {
      checkAdminAccount();
    }
  }, [adminAccountChecked, isAuthenticated]);
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }
  
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </MainLayout>
  );
};

export default Login;
