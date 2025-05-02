
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

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

const HospitalUsersTable = () => {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      // Pull donors and recipients from auth users through their metadata
      const { data: donors = [], error: donorErr } = await supabase.from("donors").select("*");
      
      if (donorErr) {
        console.error("Error fetching donors:", donorErr);
        throw donorErr;
      }
      
      // Add role property to each user
      const usersWithRoles: UserWithRole[] = donors.map(donor => ({
        ...donor,
        role: "donor"
      }));
      
      return usersWithRoles;
    }
  });

  useEffect(() => {
    // Listen for real-time changes on donors table
    const channel = supabase
      .channel("realtime:all-users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donors" },
        () => {
          console.log("User data changed, refreshing...");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
