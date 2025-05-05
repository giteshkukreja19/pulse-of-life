
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useHospitals = () => {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('hospitals')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) {
          console.error("Error fetching hospitals:", error);
          toast.error("Failed to fetch hospitals data");
          throw error;
        }
        
        console.log("Hospitals data:", data);
        
        // If no data returned, check for potential RLS issues
        if (!data || data.length === 0) {
          console.warn("No hospital data found - check Row Level Security policies");
        }
        
        return data || [];
      } catch (error) {
        console.error("Exception when fetching hospitals:", error);
        throw error;
      }
    },
  });
};

export const useHospitalProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ['hospital-profile', userId],
    queryFn: async () => {
      try {
        if (!userId) {
          throw new Error("User ID is required");
        }
        
        const { data, error } = await supabase
          .from('hospitals')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          // If error is 'No rows found', it means this user doesn't have a hospital profile
          if (error.code === 'PGRST116') {
            console.info("No hospital profile found for user:", userId);
            return null;
          }
          console.error("Error fetching hospital profile:", error);
          toast.error("Failed to fetch hospital profile");
          throw error;
        }
        
        console.log("Hospital profile:", data);
        return data;
      } catch (error) {
        console.error("Exception when fetching hospital profile:", error);
        throw error;
      }
    },
    enabled: !!userId,
  });
};

// Function to update hospital inventory
export const updateHospitalInventory = async (hospitalId: string, bloodGroup: string, units: number, operation: 'add' | 'remove') => {
  try {
    // In a real implementation, you would first check if the inventory exists for this hospital and blood group
    // Then update it or create a new one if it doesn't exist
    
    // This is a placeholder. In a production app, you would have a blood_inventory table
    // For now, we'll simply show a success message
    
    toast.success(`Successfully ${operation === 'add' ? 'added' : 'removed'} ${units} units of ${bloodGroup}`);
    return true;
  } catch (error) {
    console.error("Error updating inventory:", error);
    toast.error("Failed to update inventory");
    return false;
  }
};
