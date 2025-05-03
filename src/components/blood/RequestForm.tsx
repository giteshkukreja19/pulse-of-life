
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: "low", label: "Low - Within a week" },
  { value: "medium", label: "Medium - Within 2-3 days" },
  { value: "high", label: "High - Within 24 hours" },
  { value: "critical", label: "Critical - Immediate need" },
];

// Form validation schema
const requestFormSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  units: z.string().min(1, "Number of units is required"),
  urgency: z.string().min(1, "Urgency level is required"),
  hospital: z.string().min(2, "Hospital name is required"),
  location: z.string().min(2, "Location is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  notes: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

const RequestForm = () => {
  const { toast } = useToast();
  const { userId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      patientName: "",
      bloodGroup: "",
      units: "1",
      urgency: "",
      hospital: "",
      location: "",
      contactName: "",
      contactPhone: "",
      notes: "",
    },
  });

  const onSubmit = async (values: RequestFormValues) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a blood request",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Submit the blood request to Supabase
      const { data, error } = await supabase.from("blood_requests").insert({
        patient_name: values.patientName,
        blood_group: values.bloodGroup,
        units: parseInt(values.units),
        urgency: values.urgency,
        hospital: values.hospital,
        location: values.location,
        contact_name: values.contactName,
        contact_phone: values.contactPhone,
        notes: values.notes,
        user_id: userId,
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast({
        title: "Request submitted",
        description: "Your blood request has been submitted successfully",
      });
      
      // Reset form after successful submission
      form.reset({
        patientName: "",
        bloodGroup: "",
        units: "1",
        urgency: "",
        hospital: "",
        location: "",
        contactName: "",
        contactPhone: "",
        notes: "",
      });
      
    } catch (error: any) {
      console.error("Error submitting blood request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit blood request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-navy/20 bg-white">
      <CardHeader className="space-y-1 bg-white border-b">
        <CardTitle className="text-2xl font-bold text-navy">Request Blood</CardTitle>
        <CardDescription>
          Fill out this form to request blood donation. We'll match you with potential donors.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  For critical emergencies, please also contact your local hospital or blood bank directly 
                  after submitting this request.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of the patient" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group Needed</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Blood Group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="units"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units Required</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Urgency Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hospital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital/Medical Center</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Name of the hospital"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code/ZIP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter postal/ZIP code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Name of the contact person"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (234) 567-8901"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information that might be helpful"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-navy hover:bg-navy/90 text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Blood Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;
