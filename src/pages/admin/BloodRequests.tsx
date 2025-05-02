
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBloodRequestsRealtime } from "@/hooks/useBloodRequestsRealtime";
import { supabase } from "@/integrations/supabase/client";

const BloodRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: bloodRequests = [], isLoading, error, refetch } = useBloodRequestsRealtime();

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      toast.success("Blood request approved successfully");
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast.success("Blood request rejected successfully");
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error("Failed to reject request");
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blood Requests</h1>
            <p className="text-muted-foreground">
              Manage and respond to blood donation requests
            </p>
          </div>
          <div className="flex w-full md:w-auto max-w-sm items-center space-x-2">
            <Input 
              placeholder="Search requests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Blood Requests</CardTitle>
            <CardDescription>Real-time view of all blood donation requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading requests...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">Error loading requests. Please try again.</div>
            ) : bloodRequests.length === 0 ? (
              <div className="text-center py-4">No blood requests found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodRequests
                    .filter(request => 
                      request.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      request.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      request.blood_group?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.patient_name}</TableCell>
                        <TableCell>
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {request.blood_group}
                          </span>
                        </TableCell>
                        <TableCell>{request.units}</TableCell>
                        <TableCell>{request.hospital}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            request.urgency === "Critical" 
                              ? "bg-red-100 text-red-800" 
                              : request.urgency === "High" 
                              ? "bg-orange-100 text-orange-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {request.urgency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            request.status === "pending" 
                              ? "bg-blue-100 text-blue-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(request.created_at || '').toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {request.status === "pending" && (
                              <>
                                <Button 
                                  onClick={() => handleApprove(request.id)} 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  Approve
                                </Button>
                                <Button 
                                  onClick={() => handleReject(request.id)} 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BloodRequests;
