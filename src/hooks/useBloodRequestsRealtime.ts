
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      console.log("Fetching blood requests with filters:", filters);

      try {
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
        
        if (error) {
          console.error("Error fetching blood requests:", error);
          throw error;
        }
        
        console.log(`Successfully fetched ${data?.length} blood requests`);
        return data || [];
      } catch (err) {
        handleSupabaseError(err, "Failed to fetch blood requests");
        return [];
      }
    },
    refetchInterval: 30000, // Fallback refetch every 30 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
    retry: 3, // Retry failed requests 3 times
  });

  useEffect(() => {
    // Create a unique channel name using all filter values
    const filterValues = filters ? Object.values(filters).filter(Boolean).join('-') : 'all';
    const channelName = `blood-requests-${filterValues}-${Date.now()}`;
    console.log(`Setting up realtime channel: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
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
        console.log(`Blood requests realtime subscription status (${channelName}):`, status);
        
        if (status === 'CHANNEL_ERROR') {
          console.error(`Channel error for ${channelName}. Attempting to reconnect...`);
          setTimeout(() => {
            channel.subscribe();
          }, 5000);
        }
      });

    // Make an initial refetch to ensure we have the latest data
    query.refetch();

    return () => {
      console.log(`Unsubscribing from blood requests realtime updates (${channelName})`);
      supabase.removeChannel(channel);
    };
  }, [query, filters]);

  return query;
};
