
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  blood_group?: string;
  phone?: string;
  location?: string;
  last_donation?: string;
  role: string;
  user_id: string;
}

const HospitalUsersTable = ({ roleFilter }: { roleFilter?: string }) => {
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["all-users", roleFilter],
    queryFn: async () => {
      try {
        // Pull donors from database
        const { data: donors = [], error: donorErr } = await supabase.from("donors").select("*");
        
        if (donorErr) {
          console.error("Error fetching donors:", donorErr);
          throw donorErr;
        }
        
        // Get all users from auth
        const { data: { users: authUsers } = { users: [] }, error: authErr } = await supabase.auth.admin.listUsers();
        
        if (authErr) {
          console.error("Error fetching auth users:", authErr);
          // Continue with donors only if auth fails
        }
        
        // Map donors to include role
        let usersWithRoles: UserWithRole[] = donors.map(donor => ({
          ...donor,
          role: "donor"
        }));
        
        // If roleFilter is provided, filter users by role
        if (roleFilter) {
          usersWithRoles = usersWithRoles.filter(user => 
            user.role.toLowerCase() === roleFilter.toLowerCase()
          );
        }
        
        return usersWithRoles;
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to fetch users");
        return [];
      }
    },
    refetchInterval: 10000 // Refresh every 10 seconds as backup
  });

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for users");
    
    // Listen for changes to donors table
    const donorsChannel = supabase
      .channel("donors-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donors" },
        (payload) => {
          console.log("Donors table changed:", payload);
          // Force refresh data
          refetch();
        }
      )
      .subscribe((status) => {
        console.log("Donors subscription status:", status);
      });

    return () => {
      console.log("Cleaning up real-time subscriptions");
      supabase.removeChannel(donorsChannel);
    };
  }, [refetch]);

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-4">Loading users...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">Error loading users. Please try again.</div>
      ) : users.length === 0 ? (
        <div className="text-center py-4">No users found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Donation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "donor" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.blood_group}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.last_donation ? new Date(user.last_donation).toLocaleString() : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default HospitalUsersTable;
