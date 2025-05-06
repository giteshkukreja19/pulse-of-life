
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Donor {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
  blood_type?: string;
  city?: string;
  phone?: string;
  is_available?: boolean;
  last_donation_date?: string;
  created_at: string;
}

export const useDonors = () => {
  const query = useQuery({
    queryKey: ["donors"],
    queryFn: async () => {
      try {
        // First try to fetch from the donors table
        const { data: donorsData, error: donorsError } = await supabase
          .from("donors")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (donorsError) {
          console.error("Error fetching from donors table:", donorsError);
          
          // Fallback to the profiles table for donor data
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "donor")
            .order("created_at", { ascending: false });
            
          if (profilesError) {
            console.error("Error fetching donors from profiles:", profilesError);
            throw profilesError;
          }
          
          return profilesData || [];
        }
        
        // Handle case where data is null
        return donorsData || [];
      } catch (error) {
        console.error("Failed to fetch donors:", error);
        throw error;
      }
    },
  });

  useEffect(() => {
    // Generate a unique channel ID for this component instance
    const channelId = `donors-realtime-changes-${Math.random().toString(36).substring(2, 8)}`;
    
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donors" },
        (payload) => {
          console.log("Donors realtime update received:", payload);
          // Force refetch on any change
          query.refetch();
        }
      )
      .subscribe((status) => {
        console.log(`Donors realtime subscription status (${channelId}):`, status);
      });

    // Also listen for changes on the profiles table
    const profilesChannel = supabase
      .channel(`profiles-realtime-${Math.random().toString(36).substring(2, 8)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Profiles realtime update received:", payload);
          // Force refetch on any change
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      console.log(`Unsubscribing from donors realtime updates (${channelId})`);
      supabase.removeChannel(channel);
      supabase.removeChannel(profilesChannel);
    };
  }, [query]);

  return query;
};
