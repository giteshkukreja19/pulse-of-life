
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDonors = () => {
  const query = useQuery({
    queryKey: ["donors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching donors:", error);
        throw error;
      }
      
      return data || [];
    },
  });

  useEffect(() => {
    // Setup realtime updates with proper channel naming
    const channel = supabase
      .channel("donors-realtime-changes")
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
        console.log("Donors realtime subscription status:", status);
      });

    return () => {
      console.log("Unsubscribing from donors realtime updates");
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};
