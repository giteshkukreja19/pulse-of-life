
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

interface BloodInventoryItem {
  id: string;
  hospital_id: string;
  blood_group: string;
  units: number;
  updated_at: string;
}

// Function to update hospital inventory
export const updateHospitalInventory = async (hospitalId: string, bloodGroup: string, units: number, operation: 'add' | 'remove') => {
  try {
    // First check if blood inventory entry already exists for this hospital and blood group
    const { data: existingInventory, error: fetchError } = await supabase
      .from('blood_inventory')
      .select('*')
      .eq('hospital_id', hospitalId)
      .eq('blood_group', bloodGroup)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error checking inventory:", fetchError);
      toast.error("Failed to check inventory status");
      return false;
    }
    
    // Calculate new units based on operation
    let newUnits = units;
    if (existingInventory) {
      newUnits = operation === 'add' 
        ? (existingInventory as BloodInventoryItem).units + units 
        : (existingInventory as BloodInventoryItem).units - units;
      
      // Prevent negative inventory
      if (newUnits < 0) {
        toast.error(`Cannot remove more units than available (${(existingInventory as BloodInventoryItem).units})`);
        return false;
      }
    } else if (operation === 'remove') {
      toast.error("Cannot remove units from non-existent inventory");
      return false;
    }
    
    // Upsert the inventory
    const { error: upsertError } = await supabase
      .from('blood_inventory')
      .upsert(
        {
          hospital_id: hospitalId,
          blood_group: bloodGroup,
          units: newUnits,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'hospital_id,blood_group' }
      );
      
    if (upsertError) {
      console.error("Error updating inventory:", upsertError);
      toast.error("Failed to update inventory");
      return false;
    }
    
    toast.success(`Successfully ${operation === 'add' ? 'added' : 'removed'} ${units} units of ${bloodGroup}`);
    return true;
  } catch (error) {
    console.error("Exception updating inventory:", error);
    toast.error("Failed to update inventory");
    return false;
  }
};

export const useHospitalInventory = (hospitalId: string | null) => {
  return useQuery({
    queryKey: ['hospital-inventory', hospitalId],
    queryFn: async () => {
      try {
        if (!hospitalId) {
          throw new Error("Hospital ID is required");
        }
        
        const { data, error } = await supabase
          .from('blood_inventory')
          .select('*')
          .eq('hospital_id', hospitalId);
        
        if (error) {
          console.error("Error fetching hospital inventory:", error);
          toast.error("Failed to fetch inventory data");
          throw error;
        }
        
        console.log("Hospital inventory:", data);
        return data || [];
      } catch (error) {
        console.error("Exception when fetching hospital inventory:", error);
        throw error;
      }
    },
    enabled: !!hospitalId,
  });
};
