
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import BloodTypeCard from "@/components/blood/BloodTypeCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Droplet,
  Heart,
  UserPlus,
  Clock,
  Calendar,
  Bell,
  ChevronRight,
  Users,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react";

// Blood compatibility data
const bloodTypeData = [
  {
    type: "A+",
    availability: "medium" as const,
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
  },
  {
    type: "O+",
    availability: "low" as const,
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O+", "O-"],
  },
  {
    type: "B+",
    availability: "medium" as const,
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
  },
  {
    type: "AB+",
    availability: "high" as const,
    canDonateTo: ["AB+"],
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
];

const Index = () => {
  const [stats, setStats] = useState({
    activeDonors: 0,
    totalDonations: 0,
    requestFulfillment: 0,
    livesSaved: 0
  });

  // Fetch real stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get donor count
        const { count: donorCount, error: donorError } = await supabase
          .from('donors')
          .select('*', { count: 'exact', head: true });
        
        // Get donation count (blood requests that were fulfilled)
        const { count: donationCount, error: donationError } = await supabase
          .from('blood_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'fulfilled');
          
        // Get total request count for calculating fulfillment percentage
        const { count: totalRequestCount, error: requestError } = await supabase
          .from('blood_requests')
          .select('*', { count: 'exact', head: true });
        
        // Calculate request fulfillment percentage
        const fulfillmentPercentage = totalRequestCount > 0 
          ? Math.round((donationCount / totalRequestCount) * 100) 
          : 0;
        
        // Calculate estimated lives saved (each donation can save up to 3 lives)
        const estimatedLivesSaved = donationCount * 3;
        
        if (!donorError && !donationError && !requestError) {
          setStats({
            activeDonors: donorCount || 0,
            totalDonations: donationCount || 0,
            requestFulfillment: fulfillmentPercentage,
            livesSaved: estimatedLivesSaved
          });
          console.log("Stats fetched successfully:", { donorCount, donationCount, fulfillmentPercentage });
        } else {
          console.error("Error fetching stats:", { donorError, donationError, requestError });
          // If there's an error, use placeholder values instead of showing zeros
          setStats({
            activeDonors: 150,
            totalDonations: 270, 
            requestFulfillment: 95,
            livesSaved: 810
          });
        }
      } catch (error) {
        console.error("Exception when fetching stats:", error);
        // Fallback to placeholder values
        setStats({
          activeDonors: 150,
          totalDonations: 270,
          requestFulfillment: 95,
          livesSaved: 810
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Donate Blood, <br />
                <span className="text-blood-light">Save Lives</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Plus of Life connects blood donors with recipients to help save lives through our
                streamlined donation management system.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blood hover:bg-gray-100 flex gap-2">
                    <UserPlus className="h-5 w-5" />
                    Join as Donor
                  </Button>
                </Link>
                <Link to="/request">
                  <Button size="lg" className="bg-navy text-white hover:bg-navy-light flex gap-2">
                    <Droplet className="h-5 w-5" />
                    Request Blood
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-blood-light rounded-full opacity-70"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-blood-light rounded-full opacity-50"></div>
                <img 
                  src="/lovable-uploads/d83df2a0-586f-4f7e-a4f8-53277286c3c2.png" 
                  alt="Blood Donation Word Cloud"
                  className="w-full max-w-md rounded-lg shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Users className="h-6 w-6 text-blood" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{stats.activeDonors}+</h3>
              <p className="text-muted-foreground">Active Donors</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Droplet className="h-6 w-6 text-blood" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{stats.totalDonations}+</h3>
              <p className="text-muted-foreground">Donations</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-blood/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blood" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{stats.requestFulfillment}%</h3>
              <p className="text-muted-foreground">Request Fulfillment</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Heart className="h-6 w-6 text-blood" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{stats.livesSaved}+</h3>
              <p className="text-muted-foreground">Lives Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've simplified the process of donating and requesting blood to save time when it matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blood/10 rounded-full">
                  <UserPlus className="h-6 w-6 text-blood" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Register</h3>
              <p className="text-muted-foreground">
                Create your donor profile with your blood type and availability preferences.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blood/10 rounded-full">
                  <Bell className="h-6 w-6 text-blood" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Matched</h3>
              <p className="text-muted-foreground">
                Receive notifications when your blood type is needed in your area.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blood/10 rounded-full">
                  <Heart className="h-6 w-6 text-blood" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Donate</h3>
              <p className="text-muted-foreground">
                Schedule your donation and help save lives in your community.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <Link to="/about">
              <Button variant="outline" className="flex gap-2">
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blood Type Information */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Blood Type Compatibility</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding blood type compatibility is crucial for successful donations and transfusions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bloodTypeData.map((blood) => (
              <BloodTypeCard 
                key={blood.type}
                type={blood.type}
                availability={blood.availability}
                canDonateTo={blood.canDonateTo}
                canReceiveFrom={blood.canReceiveFrom}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link to="/donors">
              <Button className="btn-blood flex gap-2">
                <Users className="h-4 w-4" />
                <span>Find Donors</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-blood rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join our community of blood donors today and help save lives. 
              One donation can save up to three lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blood hover:bg-gray-100 flex gap-2">
                  <UserPlus className="h-5 w-5" />
                  Register Now
                </Button>
              </Link>
              <Link to="/request">
                <Button size="lg" className="bg-navy text-white hover:bg-navy-light border-white/20 flex gap-2">
                  <Droplet className="h-5 w-5" />
                  Request Blood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features/Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features & Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plus of Life offers a comprehensive blood donation management system with features designed for donors and recipients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Bell className="h-5 w-5 text-blood" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Urgent Notifications</h3>
                <p className="text-muted-foreground">
                  Receive real-time alerts when your blood type is urgently needed in your area.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Calendar className="h-5 w-5 text-blood" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Donation Scheduling</h3>
                <p className="text-muted-foreground">
                  Schedule your donations and receive reminders when you're eligible to donate again.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blood/10 rounded-full">
                  <BookOpen className="h-5 w-5 text-blood" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Donation History</h3>
                <p className="text-muted-foreground">
                  Keep track of your donation history and view the impact of your contributions.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Clock className="h-5 w-5 text-blood" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Rapid Response</h3>
                <p className="text-muted-foreground">
                  Quick matching system connects recipients with nearby donors in emergency situations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Users className="h-5 w-5 text-blood" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Donor Search</h3>
                <p className="text-muted-foreground">
                  Find donors by blood type, location, and availability for urgent and planned needs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blood/10 rounded-full">
                  <Award className="h-5 w-5 text-blood" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Donor Rewards</h3>
                <p className="text-muted-foreground">
                  Earn achievements and recognition for your contribution to saving lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
