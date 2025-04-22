
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, UserPlus } from "lucide-react";

const HospitalRegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zip: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.licenseNumber ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.phone ||
      !formData.zip
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const metadata: any = {
        name: formData.name,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        phone: formData.phone,
        zip: formData.zip,
      };

      const success = await register(
        formData.email,
        formData.password,
        "hospital",
        metadata
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
    <Card className="w-[350px] md:w-[480px] card-gradient shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Register your Hospital</CardTitle>
        <CardDescription className="text-center">
          Join Pulse of Life and help manage blood donations for your region.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hospital Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="City General Hospital"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Hospital License Number</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              placeholder="HL-12345678"
              required
              value={formData.licenseNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Healthcare Ave"
              required
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Chicago"
                required
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                placeholder="Illinois"
                required
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
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
              <Label htmlFor="zip">Zip Code</Label>
              <Input
                id="zip"
                name="zip"
                placeholder="12345"
                required
                value={formData.zip}
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
              placeholder="admin@hospital.com"
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
          <Button
            type="submit"
            className="w-full btn-blood flex gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            Register Hospital
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
      </CardFooter>
    </Card>
  );
};

export default HospitalRegisterForm;
