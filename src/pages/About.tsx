import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Heart, Users, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold">About Plus of Life</h1>
              <p className="text-lg opacity-90">
                A smart blood donation management system connecting donors with 
                recipients and making the donation process seamless and efficient.
              </p>
            </div>
            <div className="hidden md:block bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <blockquote className="italic text-lg">
                "Every blood donor is a lifesaver. Our mission is to build the bridge 
                between those who can give and those who desperately need."
                <footer className="mt-2 text-blood-light font-medium not-italic">
                  — Plus of Life Team
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-blood/5 p-8 rounded-2xl border border-blood/20">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blood/10 rounded-full mr-3">
                  <Heart className="h-6 w-6 text-blood" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg">
                To digitize and simplify the process of blood donation and requests, 
                creating a responsive ecosystem that connects donors with those in need, 
                ultimately saving more lives through efficient blood donation management.
              </p>
            </div>
            
            <div className="bg-navy/5 p-8 rounded-2xl border border-navy/20">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-navy/10 rounded-full mr-3">
                  <Target className="h-6 w-6 text-navy" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-lg">
                To build a world where no one faces a shortage of blood in emergency situations,
                where donation is accessible and widespread, and where the gap between donors 
                and recipients is bridged through technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Plus of Life was born from a simple yet powerful observation: while many people were 
              willing to donate blood, the systems connecting them to those in need were often fragmented, 
              inefficient, and difficult to navigate.
            </p>
            
            <p>
              In late 2024, a group of medical students and technology enthusiasts came together with a 
              shared vision: to revolutionize blood donation through a centralized digital platform. 
              They had witnessed firsthand the challenges hospitals faced during emergencies when 
              specific blood types were urgently needed.
            </p>
            
            <p>
              The team spent months researching existing systems, speaking with blood banks, hospitals, 
              and frequent donors to understand the pain points in the current process. What emerged was 
              a blueprint for a comprehensive system that would not only match donors with recipients but 
              also gamify the donation process, track donation history, and provide real-time updates on 
              blood needs.
            </p>
            
            <p>
              By early 2025, Plus of Life launched its beta version, immediately connecting hundreds of donors 
              with recipients in need. The platform's success stories began pouring in – from emergency 
              surgeries made possible by rapid donor matching to routine transfusions simplified through 
              the scheduling system.
            </p>
            
            <p>
              Today, Plus of Life continues to grow, adding new features based on user feedback and expanding 
              to more regions. Our team remains committed to the original mission: making blood donation as 
              seamless as possible to ensure that no one ever has to wait for life-saving blood when they need it most.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section - Updated with only two founders */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The dedicated professionals behind Plus of Life, committed to making blood donation accessible and efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                  alt="Hemang Jeswani" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Hemang Jeswani</h3>
              <p className="text-blood font-medium">Co-Founder & Engineering Student</p>
              <p className="text-sm text-muted-foreground mt-2">
                Engineering student with a passion for healthcare technology and accessible blood donation solutions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                  alt="Gitesh Kukreja" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Gitesh Kukreja</h3>
              <p className="text-blood font-medium">Co-Founder & Engineering Student</p>
              <p className="text-sm text-muted-foreground mt-2">
                Tech innovator focusing on healthcare solutions with a background in software development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4 bg-blood text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Since our launch, Plus of Life has made a significant difference in the blood donation ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-4xl font-bold">8,100+</h3>
                <p className="text-xl mt-2">Lives Saved</p>
                <p className="mt-4 text-sm opacity-90">
                  Through successful blood donations and emergency request fulfillment.
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-4xl font-bold">2,700+</h3>
                <p className="text-xl mt-2">Donations Facilitated</p>
                <p className="mt-4 text-sm opacity-90">
                  Connecting willing donors with recipients and blood banks.
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-4xl font-bold">95%</h3>
                <p className="text-xl mt-2">Urgent Request Fulfillment</p>
                <p className="mt-4 text-sm opacity-90">
                  Critical requests matched with donors in under 6 hours.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg mb-6">
              Join us in making an even bigger impact by becoming a donor today.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-blood hover:bg-gray-100 flex gap-2">
                <Users className="h-5 w-5" />
                Join Our Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about blood donation and our platform.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Who can donate blood?</h3>
              <p className="text-muted-foreground">
                Generally, anyone in good health, aged 18-65, weighing at least 110 lbs can donate blood. 
                There may be additional eligibility criteria based on medical history, recent travel, and medications.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">How often can I donate blood?</h3>
              <p className="text-muted-foreground">
                Whole blood donors can give every 56 days (8 weeks). Platelet donors can give more frequently, 
                up to 24 times per year, while plasma donors can donate every 28 days.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Is donating blood safe?</h3>
              <p className="text-muted-foreground">
                Yes, donating blood is very safe. All equipment is sterile and used only once. The average adult has 
                about 10 pints of blood, and a donation is only about 1 pint, which your body replaces quickly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">How does Plus of Life verify donations?</h3>
              <p className="text-muted-foreground">
                Donations made through our platform partners are automatically verified. For donations at other locations, 
                users can upload donation certificates or receipts, which our team verifies with the respective blood banks.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/request">
              <Button variant="outline" className="flex gap-2">
                <span>Have more questions?</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Lifesaving Mission</h2>
            <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
              Whether you're a donor, recipient, or just want to support our cause, 
              there's a place for you in the Plus of Life community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="btn-blood flex gap-2">
                  <Users className="h-5 w-5" />
                  Register Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="flex gap-2">
                  <span>Contact Us</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
