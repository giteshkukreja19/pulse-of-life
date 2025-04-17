
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
      try {
        // First check if admin account exists
        const { data: { users }, error: checkError } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 10,
        });
        
        if (checkError) {
          // If we can't check users via admin API, try to sign in with admin credentials
          const { data: adminAuth } = await supabase.auth.signInWithPassword({
            email: 'admin@pulseoflife.com',
            password: 'pulseoflife'
          });
          
          // If sign in successful, admin account exists
          if (adminAuth.user) {
            console.log('Admin account already exists');
            // Sign out to allow normal login flow
            await supabase.auth.signOut();
            return;
          }
        } else if (users && users.some(user => 
          user.email === 'admin@pulseoflife.com' && 
          user.user_metadata && 
          user.user_metadata.role === 'admin'
        )) {
          console.log('Admin account already exists');
          return;
        }
        
        // Create admin account if it doesn't exist
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
          toast.error('Failed to create admin account: ' + signUpError.message);
        } else if (signUpData.user) {
          console.log('Admin account created successfully');
          toast.success('Admin account created successfully');
          
          // For development, auto-confirm the admin email
          try {
            const adminConfirmResult = await supabase.auth.admin.updateUserById(
              signUpData.user.id,
              { email_confirm: true }
            );
            
            if (adminConfirmResult.error) {
              console.error('Could not auto-confirm admin email:', adminConfirmResult.error);
            } else {
              console.log('Admin email auto-confirmed');
            }
          } catch (confirmError) {
            console.error('Error during admin email confirmation:', confirmError);
          }
        }
      } catch (error) {
        console.error('Unexpected error creating admin account:', error);
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
