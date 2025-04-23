
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, User, Heart, Hospital, ShieldCheck } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, authError } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<UserRole>("donor");
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

  const handleSubmit = async (e: React.FormEvent, role: UserRole) => {
    e.preventDefault();
    setLocalError(null);
    
    // Validate form
    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Attempt login using our context's login function
      const success = await login(formData.email, formData.password, role);
      
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
        <Tabs defaultValue="donor" onValueChange={(value) => setActiveTab(value as UserRole)}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="donor" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Donor</span>
            </TabsTrigger>
            <TabsTrigger value="hospital" className="flex items-center gap-2">
              <Hospital className="h-4 w-4" />
              <span>Hospital</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="donor">
            <form onSubmit={(e) => handleSubmit(e, 'donor')} className="space-y-4">
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
              <Button 
                type="submit" 
                className="w-full btn-blood flex gap-2"
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                Sign In as Donor
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="hospital">
            <form onSubmit={(e) => handleSubmit(e, 'hospital')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hospital-email">Hospital Email</Label>
                <Input
                  id="hospital-email"
                  name="email"
                  type="email"
                  placeholder="hospital@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hospital-password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blood hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="hospital-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full btn-blood flex gap-2"
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                Sign In as Hospital
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
            <form onSubmit={(e) => handleSubmit(e, 'admin')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blood hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full btn-blood flex gap-2"
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                Sign In as Admin
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blood hover:underline font-medium">
            Register
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
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
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
