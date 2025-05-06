
import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";
import { toast } from "sonner";

const Login = () => {
  const { isAuthenticated, authError, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Login | Pulse of Life";
  }, []);
  
  // Only show toast on initial mount if there's an error
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  // Effect to redirect to appropriate page based on role
  useEffect(() => {
    if (isAuthenticated && userRole) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, userRole, navigate]);
  
  // Redirect if user is already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
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
