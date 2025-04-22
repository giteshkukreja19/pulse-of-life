
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BloodRequestFilters {
  bloodGroup?: string;
  location?: string;
  status?: string;
}

export const useBloodRequests = (filters?: BloodRequestFilters) => {
  return useQuery({
    queryKey: ['blood-requests', filters],
    queryFn: async () => {
      let query = supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Apply filters if provided
      if (filters?.bloodGroup) {
        query = query.eq('blood_group', filters.bloodGroup);
      }
      
      if (filters?.location) {
        query = query.eq('location', filters.location);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};
