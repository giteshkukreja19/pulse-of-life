
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/App";

const Login = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
