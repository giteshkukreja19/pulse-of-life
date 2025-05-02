
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, Plus, Heart, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "./StatCard";
import { AuthContext } from "@/App";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecipientDashboardProps {
  onActionSuccess: (action: string) => void;
  bloodRequests: any[];
}

const RecipientDashboard = ({ onActionSuccess, bloodRequests = [] }: RecipientDashboardProps) => {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("all");

  const filteredRequests = bloodRequests.filter(request => {
    if (activeTab === "all") return true;
    return request.status === activeTab;
  });

  const pendingCount = bloodRequests.filter(r => r.status === "pending").length;
  const approvedCount = bloodRequests.filter(r => r.status === "approved").length;
  const rejectedCount = bloodRequests.filter(r => r.status === "rejected").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Recipient Dashboard</h1>
          <p className="text-muted-foreground">
            Request and manage blood donations
          </p>
        </div>
        <Button onClick={() => navigate("/request")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Pending Requests"
          value={pendingCount.toString()}
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          description="Waiting for approval"
        />
        <StatCard
          title="Approved Requests"
          value={approvedCount.toString()}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          description="Ready for donation"
        />
        <StatCard
          title="Rejected Requests"
          value={rejectedCount.toString()}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          description="Need revision"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-blood" />
            <span>Your Blood Donation Requests</span>
          </CardTitle>
          <CardDescription>
            View and manage your blood donation requests
          </CardDescription>
          <div className="flex space-x-2 pt-2">
            <Badge 
              className={`cursor-pointer ${activeTab === 'all' ? 'bg-primary' : 'bg-secondary'}`} 
              onClick={() => setActiveTab('all')}
            >
              All
            </Badge>
            <Badge 
              className={`cursor-pointer ${activeTab === 'pending' ? 'bg-yellow-500' : 'bg-secondary'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </Badge>
            <Badge 
              className={`cursor-pointer ${activeTab === 'approved' ? 'bg-green-500' : 'bg-secondary'}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </Badge>
            <Badge 
              className={`cursor-pointer ${activeTab === 'rejected' ? 'bg-red-500' : 'bg-secondary'}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {bloodRequests.length === 0 ? (
            <div className="text-center py-8">
              <Droplet className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No blood donation requests</h3>
              <p className="text-gray-500 mb-4">
                You haven't requested any blood donations yet.
              </p>
              <Button onClick={() => navigate("/request")}>Request Blood</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.patient_name}</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {request.blood_group}
                      </span>
                    </TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>{request.hospital}</TableCell>
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
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            All requests are reviewed by administrators and matched with available donors.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecipientDashboard;
