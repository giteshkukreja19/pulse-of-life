
import { useContext, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("donor");
  const [showPassword, setShowPassword] = useState(false);
  const { login, authError, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      await login(email, password, role);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const renderError = () => {
    if (authError) {
      return (
        <div className="text-red-500 text-sm mt-2">{authError}</div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-lg bg-white p-8 shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium block mb-2">
            Login as
          </Label>
          <RadioGroup 
            value={role} 
            onValueChange={setRole} 
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="donor" id="donor" />
              <Label htmlFor="donor">User / Donor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hospital" id="hospital" />
              <Label htmlFor="hospital">Hospital</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              className="mr-2 leading-tight"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-sm">Remember me</span>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Forgot Password?
          </button>
        </div>
        {renderError()}
        <Button type="submit" className="w-full bg-blood hover:bg-blood/90" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="text-center text-gray-700 text-sm mt-4">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-bold text-blue-500 hover:text-blue-800"
        >
          Register
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
