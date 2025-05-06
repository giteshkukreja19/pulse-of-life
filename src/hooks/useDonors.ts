
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDonors = () => {
  const query = useQuery({
    queryKey: ["donors"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("donors")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching donors:", error);
          throw error;
        }
        
        // Handle case where data is null
        return data || [];
      } catch (error) {
        console.error("Failed to fetch donors:", error);
        throw error;
      }
    },
  });

  useEffect(() => {
    // Setup realtime updates with proper channel naming
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

    return () => {
      console.log(`Unsubscribing from donors realtime updates (${channelId})`);
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};
