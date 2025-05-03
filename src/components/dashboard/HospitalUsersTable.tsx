
import { useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthContext } from "@/App";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
  const { userRole } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["all-users", roleFilter, userRole],
    queryFn: async () => {
      try {
        console.log(`Fetching users with role filter: ${roleFilter}, user role: ${userRole}`);
        
        // Pull donors from database
        const { data: donors = [], error: donorErr } = await supabase
          .from("donors")
          .select("*");
        
        if (donorErr) {
          console.error("Error fetching donors:", donorErr);
          throw donorErr;
        }
        
        console.log(`Successfully fetched ${donors.length} donors`);
        
        // Get all users from auth - this is not available directly, so we're using the donors table
        // In a production app, you might want to create a separate users table or use an admin API
        
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
          console.log(`Filtered to ${usersWithRoles.length} users with role: ${roleFilter}`);
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

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.blood_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for users");
    
    // Listen for changes to donors table
    const donorsChannel = supabase
      .channel("donors-changes-" + (Math.random().toString(36).substring(7)))
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
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input 
          placeholder="Search users..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm" 
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">Error loading users. Please try again.</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-4">
          {searchTerm ? "No users match your search." : "No users found."}
        </div>
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "donor" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.blood_group || "N/A"}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>{user.location || "N/A"}</TableCell>
                <TableCell>{user.last_donation ? new Date(user.last_donation).toLocaleString() : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default HospitalUsersTable;
