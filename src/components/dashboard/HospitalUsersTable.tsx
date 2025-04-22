
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const HospitalUsersTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // Pull donors and recipients (assuming in the same donors table, otherwise add logic for recipients)
      let { data: donors = [], error: donorErr } = await supabase.from("donors").select("*");
      // If there are different recipients table, fetch here as well and merge
      setUsers(donors);
      setLoading(false);
    };

    fetchUsers();

    // Listen for real-time changes on donors table
    const channel = supabase
      .channel("realtime:donors-all")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donors" },
        () => fetchUsers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading users...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Donation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
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
