
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const { isAuthenticated, authError } = useContext(AuthContext);
  
  useEffect(() => {
    document.title = "Register | Pulse of Life";
  }, []);
  
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);
  
  useEffect(() => {
    const createAdminAccount = async () => {
      const { data: adminCheck } = await supabase.auth.signInWithPassword({
        email: 'admin@pulseoflife.com',
        password: 'pulseoflife'
      });

      if (!adminCheck.user) {
        const { error } = await supabase.auth.signUp({
          email: 'admin@pulseoflife.com',
          password: 'pulseoflife',
          options: {
            data: {
              role: 'admin',
              name: 'System Admin'
            }
          }
        });

        if (error) {
          console.error('Error creating admin account:', error);
        } else {
          console.log('Admin account created successfully');
        }
      }
    };

    createAdminAccount();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </MainLayout>
  );
};

export default Register;
