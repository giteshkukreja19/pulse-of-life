
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BloodTypeCard from "./BloodTypeCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define blood compatibility data
const BLOOD_COMPATIBILITY = {
  "A+": {
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"]
  },
  "A-": {
    canDonateTo: ["A+", "A-", "AB+", "AB-"],
    canReceiveFrom: ["A-", "O-"]
  },
  "B+": {
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"]
  },
  "B-": {
    canDonateTo: ["B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["B-", "O-"]
  },
  "AB+": {
    canDonateTo: ["AB+"],
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  },
  "AB-": {
    canDonateTo: ["AB+", "AB-"],
    canReceiveFrom: ["A-", "B-", "AB-", "O-"]
  },
  "O+": {
    canDonateTo: ["A+", "B+", "AB+", "O+"],
    canReceiveFrom: ["O+", "O-"]
  },
  "O-": {
    canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    canReceiveFrom: ["O-"]
  }
};

const BloodCompatibility = () => {
  // Fetch blood inventory data
  const { data: bloodInventory = [] } = useQuery({
    queryKey: ["blood-inventory"],
    queryFn: async () => {
      try {
        // This would normally fetch from a blood_inventory table
        // For now, we'll use the blood_requests to calculate availability estimates
        const { data, error } = await supabase
          .from('blood_requests')
          .select('*');
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching blood inventory:", error);
        return [];
      }
    },
  });
  
  // Calculate blood type availability based on request patterns
  const calculateAvailability = (bloodGroup: string): "high" | "medium" | "low" => {
    const requestsForType = bloodInventory.filter(req => req.blood_group === bloodGroup);
    
    if (requestsForType.length === 0) {
      return "high"; // No requests = high availability
    }
    
    const pendingRequestsCount = requestsForType.filter(req => req.status === 'pending').length;
    const totalRequestsCount = requestsForType.length;
    const pendingRatio = pendingRequestsCount / totalRequestsCount;
    
    if (pendingRatio > 0.7) return "low";
    if (pendingRatio > 0.3) return "medium";
    return "high";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Type Compatibility</CardTitle>
        <CardDescription>
          Learn about different blood types and their compatibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(BLOOD_COMPATIBILITY).map(bloodType => (
            <BloodTypeCard
              key={bloodType}
              type={bloodType}
              availability={calculateAvailability(bloodType)}
              canDonateTo={BLOOD_COMPATIBILITY[bloodType as keyof typeof BLOOD_COMPATIBILITY].canDonateTo}
              canReceiveFrom={BLOOD_COMPATIBILITY[bloodType as keyof typeof BLOOD_COMPATIBILITY].canReceiveFrom}
            />
          ))}
        </div>
        
        <div className="mt-8 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Understanding Blood Type Compatibility</h3>
          <p className="mb-4">
            Blood type compatibility is crucial for safe blood transfusions. The compatibility is determined by the presence or absence of certain antigens and antibodies in blood.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Universal Donors</h4>
              <p className="text-sm text-muted-foreground">
                People with O- blood are universal donors, meaning their blood can be given to anyone regardless of blood type. This is because O- blood lacks the antigens that could trigger an immune response.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Universal Recipients</h4>
              <p className="text-sm text-muted-foreground">
                People with AB+ blood are universal recipients, meaning they can receive blood from any blood type. This is because AB+ blood doesn't have antibodies that would attack other blood types.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodCompatibility;
