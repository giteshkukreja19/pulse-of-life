
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, UserRole } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { LogIn, User, Hospital, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, authError } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user" as UserRole,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear local error when form data changes
  useEffect(() => {
    if (localError) {
      setLocalError(null);
    }
  }, [formData]);

  // Display auth context errors
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Validate form
    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const success = await login(formData.email, formData.password, formData.role);
      
      if (success) {
        toast.success("You have been logged in successfully");
        // Navigate to dashboard after login
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLocalError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
    }
  };

  // Display form error if present
  const renderError = () => {
    if (localError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
          {localError}
        </div>
      );
    }
    return null;
  };

  // Get the appropriate icon for the currently selected role
  const getRoleIcon = () => {
    switch(formData.role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 mr-2" />;
      case 'hospital':
        return <Hospital className="h-4 w-4 mr-2" />;
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Card className="w-[350px] md:w-[450px] card-gradient shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderError()}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blood hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Login as</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    User
                  </div>
                </SelectItem>
                <SelectItem value="hospital">
                  <div className="flex items-center">
                    <Hospital className="h-4 w-4 mr-2" />
                    Hospital
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Admin
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full btn-blood flex gap-2"
            disabled={isLoading || isSubmitting}
          >
            {(isLoading || isSubmitting) ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
            ) : (
              getRoleIcon()
            )}
            Sign In as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </Button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 mt-6">
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={handleGoogleLogin}
          >
            <svg role="img" viewBox="0 0 24 24" className="h-4 w-4">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blood hover:underline font-medium">
            Register
          </Link>
        </div>
        <div className="text-sm text-center">
          Register a hospital?{" "}
          <Link to="/register-hospital" className="text-blood hover:underline font-medium">
            Register Hospital
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
