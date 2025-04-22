
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
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Setup realtime updates
    const channel = supabase
      .channel("public:donors")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donors" },
        (payload) => {
          // Force refetch on any change
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};
