
import { useContext, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [role, setRole] = useState("donor");
  
  const { register, authError, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      setValidationError("Please enter your email.");
      return false;
    }
    if (!password) {
      setValidationError("Please enter your password.");
      return false;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await register(email, password, role);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-lg bg-white p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
      {authError && (
        <div className="text-red-500 mb-4">{authError}</div>
      )}
      {validationError && (
        <div className="text-red-500 mb-4">{validationError}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Register as
          </label>
          <RadioGroup 
            value={role} 
            onValueChange={setRole} 
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="donor" id="register-donor" />
              <Label htmlFor="register-donor">User / Donor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hospital" id="register-hospital" />
              <Label htmlFor="register-hospital">Hospital</Label>
            </div>
          </RadioGroup>
          {role === 'hospital' && (
            <p className="text-sm text-muted-foreground">
              To register as a hospital, complete this form and then add your hospital details in the profile section.
            </p>
          )}
        </div>
        
        <Button type="submit" className="w-full btn-blood" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
