
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Support } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

const Help = () => {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would connect to your support system (e.g. send email via Supabase Edge Function)
    console.log("Support request:", { contactName, contactEmail, contactMessage });
    
    toast.success("Your support request has been submitted. We'll get back to you soon!");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Help & Support</h1>
            <p className="text-muted-foreground">
              Find answers to common questions or contact our support team
            </p>
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Support className="h-4 w-4" />
              <span>Contact Support</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions about blood donation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Who can donate blood?</AccordionTrigger>
                    <AccordionContent>
                      <p>Most healthy adults who are at least 17 years old and weigh at least 110 pounds can donate blood. Depending on your age, health status, and other factors, you may or may not be eligible to donate. Some common eligibility requirements include:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Being in good health and feeling well</li>
                        <li>Having an adequate hemoglobin level</li>
                        <li>Not having certain medical conditions</li>
                        <li>Not having traveled to certain regions recently</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How often can I donate blood?</AccordionTrigger>
                    <AccordionContent>
                      <p>In most cases, you can donate whole blood every 56 days (about 8 weeks). If you donate other blood components like platelets, plasma, or red cells, the waiting period may be different:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Platelets: every 7 days, up to 24 times per year</li>
                        <li>Plasma: every 28 days, up to 13 times per year</li>
                        <li>Double red cells: every 112 days, up to 3 times per year</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is blood donation safe?</AccordionTrigger>
                    <AccordionContent>
                      <p>Yes, blood donation is very safe. The equipment used for donation is sterile and used only once. There's no risk of contracting any disease by donating blood.</p>
                      <p className="mt-2">Some people may experience mild side effects like:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Feeling lightheaded or dizzy</li>
                        <li>Bruising at the needle site</li>
                        <li>Fatigue</li>
                      </ul>
                      <p className="mt-2">These side effects are temporary and typically resolve quickly.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What happens during a blood donation?</AccordionTrigger>
                    <AccordionContent>
                      <p>The blood donation process includes these steps:</p>
                      <ol className="list-decimal pl-6 mt-2 space-y-1">
                        <li>Registration: You'll complete a donor registration form.</li>
                        <li>Health history and mini-physical: A staff member will ask about your health history and check your temperature, pulse, blood pressure, and hemoglobin level.</li>
                        <li>Donation: The actual blood donation takes about 8-10 minutes.</li>
                        <li>Refreshments: After donating, you'll be given snacks and drinks to help replenish your fluids.</li>
                      </ol>
                      <p className="mt-2">The entire process usually takes about an hour, though the actual blood draw only takes about 10 minutes.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How is my blood used after donation?</AccordionTrigger>
                    <AccordionContent>
                      <p>After collection, your blood is processed and separated into components (red cells, platelets, and plasma), which can help multiple patients:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Red blood cells: Used for trauma, surgery, anemia, and blood disorders</li>
                        <li>Platelets: Used for cancer treatments, transplants, and bleeding disorders</li>
                        <li>Plasma: Used for trauma, burns, and clotting factor deficiencies</li>
                      </ul>
                      <p className="mt-2">Your donation can potentially save up to three lives!</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hospital Resources</CardTitle>
                <CardDescription>
                  Information for hospital and medical professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How can my hospital join the network?</AccordionTrigger>
                    <AccordionContent>
                      <p>To register your hospital with our blood donation network:</p>
                      <ol className="list-decimal pl-6 mt-2 space-y-1">
                        <li>Visit the "Register Hospital" page</li>
                        <li>Complete the hospital registration form</li>
                        <li>Submit required documentation for verification</li>
                        <li>Wait for approval from our administrative team</li>
                      </ol>
                      <p className="mt-2">Once approved, you'll gain access to the hospital dashboard where you can manage blood requests and inventory.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How to manage blood inventory?</AccordionTrigger>
                    <AccordionContent>
                      <p>Hospital administrators can manage blood inventory through the hospital dashboard:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Log in to your hospital account</li>
                        <li>Navigate to the "Blood Inventory" tab</li>
                        <li>Add new inventory units using the "Add" button</li>
                        <li>Record usage and removals with the "Remove" button</li>
                        <li>Set up low stock alerts for critical blood types</li>
                      </ul>
                      <p className="mt-2">The system automatically updates in real-time across the network.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How to create blood requests?</AccordionTrigger>
                    <AccordionContent>
                      <p>To create a new blood request:</p>
                      <ol className="list-decimal pl-6 mt-2 space-y-1">
                        <li>Go to the "Blood Requests" section in your dashboard</li>
                        <li>Click "Create New Request"</li>
                        <li>Fill in patient details and blood requirements</li>
                        <li>Set urgency level and required units</li>
                        <li>Submit the request to broadcast to matching donors</li>
                      </ol>
                      <p className="mt-2">Nearby donors with matching blood types will be notified based on the urgency level.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Our Support Team</CardTitle>
                <CardDescription>
                  Need help? Send us a message and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSupport} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                      <Input 
                        id="name" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input 
                        id="email" 
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      rows={6}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required 
                      placeholder="Describe your issue or question in detail..."
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto btn-blood">Submit Support Request</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
                <CardDescription>
                  Contact us through other channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">gk7145@srmist.edu.in</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground">8602872714, 8824340754</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      201 Sannasi Boys Hostel Block A SRMIST, Potheri 603203
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Hours of Operation</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Weekend support available for emergencies only.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Help;
