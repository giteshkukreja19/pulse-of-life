import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send the contact form data
    console.log("Contact form submitted", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    // Show success message (would use a toast in a real app)
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about blood donation or our platform? Get in touch with our team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get In Touch</CardTitle>
                  <CardDescription>
                    Our team is here to help with any questions you might have.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blood flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Our Address</h3>
                      <p className="text-sm text-muted-foreground">
                        201 Sannasi Boys Hostel Block A<br />
                        SRMIST, Potheri 603203
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blood flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone Number</h3>
                      <p className="text-sm text-muted-foreground">
                        8602872714, 8824340754
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blood flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email Address</h3>
                      <p className="text-sm text-muted-foreground">
                        gk7145@srmist.edu.in
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Operation Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
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
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message here..."
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full btn-blood flex gap-2"
                    onClick={(e) => handleSubmit(e as React.FormEvent)}
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions about donations and our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">How can I become a blood donor?</h3>
                  <p className="text-muted-foreground text-sm">
                    Simply register on our platform, complete your profile with accurate information, 
                    and you'll be added to our donor database. You can then set your availability and 
                    respond to donation requests.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Is my information kept private?</h3>
                  <p className="text-muted-foreground text-sm">
                    Yes, we take privacy very seriously. Your personal information is only shared with 
                    verified recipients when you agree to a donation request. All data is encrypted and 
                    stored securely.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">How does the matching system work?</h3>
                  <p className="text-muted-foreground text-sm">
                    Our system matches blood donation requests with eligible donors based on blood type, 
                    location, and availability. When a match is found, both donor and recipient are notified 
                    and can coordinate the donation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
