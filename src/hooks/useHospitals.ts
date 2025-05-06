
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
        return data || [];
      } catch (error) {
        console.error("Exception when fetching hospitals:", error);
        throw error;
      }
    },
  });
};
