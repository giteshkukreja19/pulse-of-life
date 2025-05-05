import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UserPlus, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bloodGroup: "",
    age: "",
    city: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveUserToDatabase = async (userId: string, userData: any) => {
    try {
      // Save to donors table for all users - everyone is both donor and recipient
      const { error: donorError } = await supabase.from("donors").insert({
        user_id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        blood_group: userData.bloodGroup,
        location: userData.city, 
      });

      if (donorError) {
        console.error("Error saving user data:", donorError);
        toast.error("Error saving user profile. Please try again.");
        return false;
      } else {
        console.log("User profile saved successfully");
        return true;
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Error saving user profile. Registration may be incomplete.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.bloodGroup) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      const success = await register(
        formData.email,
        formData.password,
        "donor"
      );

      if (success) {
        toast.success(
          "Registration successful! Please check your email for verification and then log in."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Card className="w-[350px] md:w-[450px] card-gradient shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Join Pulse of Life and help save lives
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="21"
                min="18"
                max="65"
                required
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (234) 567-8901"
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select 
                onValueChange={handleSelectChange("bloodGroup")}
                value={formData.bloodGroup}
              >
                <SelectTrigger id="bloodGroup">
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Mumbai"
              required
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full btn-blood flex gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create Account
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blood hover:underline font-medium">
            Sign in
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

export default RegisterForm;
