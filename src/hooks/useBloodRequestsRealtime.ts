
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BloodRequestFilters {
  bloodGroup?: string;
  location?: string;
  status?: string;
  userId?: string | null;
}

export const useBloodRequestsRealtime = (filters?: BloodRequestFilters) => {
  const query = useQuery({
    queryKey: ['blood-requests-realtime', filters],
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

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Setup realtime updates with proper channel naming
    const channel = supabase
      .channel("blood-requests-realtime-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blood_requests" },
        (payload) => {
          console.log("Blood requests realtime update received:", payload);
          // Force refetch on any change
          query.refetch();
        }
      )
      .subscribe((status) => {
        console.log("Blood requests realtime subscription status:", status);
      });

    return () => {
      console.log("Unsubscribing from blood requests realtime updates");
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};
