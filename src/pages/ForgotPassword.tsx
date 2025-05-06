
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSubmitted(true);
        toast.success("Reset password link sent to your email");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto rounded-lg bg-white p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {isSubmitted ? "Check Your Email" : "Reset Your Password"}
          </h2>
          
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>
              <p className="text-gray-500 text-sm">
                If you don't receive an email within a few minutes, check your spam folder or try again.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button variant="outline" className="mt-4">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Enter the email address you used to register. We'll send you a link to reset your password.
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blood hover:bg-blood/90" 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center">
                <Link to="/login" className="text-sm text-blue-500 hover:text-blue-800">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
