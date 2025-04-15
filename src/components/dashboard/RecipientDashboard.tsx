
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, CheckCircle, Calendar, FileText, Heart, FilePlus } from "lucide-react";
import { Link } from "react-router-dom";

interface RecipientDashboardProps {
  onActionSuccess: (action: string) => void;
}

// Mock data
const activeRequests = [
  { 
    id: "REQ-001",
    bloodGroup: "A+", 
    units: 2, 
    hospital: "Memorial Hospital", 
    requestDate: "2025-04-10", 
    status: "Pending", 
    urgency: "High",
    matches: 3
  },
];

const requestHistory = [
  { 
    id: "REQ-002",
    bloodGroup: "A+", 
    units: 1, 
    hospital: "City Medical Center", 
    requestDate: "2025-03-15", 
    status: "Fulfilled", 
    fulfillmentDate: "2025-03-16",
    donorName: "Anonymous"
  },
  { 
    id: "REQ-003",
    bloodGroup: "A+", 
    units: 2, 
    hospital: "University Hospital", 
    requestDate: "2025-02-20", 
    status: "Fulfilled", 
    fulfillmentDate: "2025-02-22",
    donorName: "Anonymous"
  },
];

const upcomingAppointments = [
  {
    id: "APT-001",
    hospital: "Memorial Hospital",
    date: "2025-04-18",
    time: "10:30 AM",
    purpose: "Pre-transfusion checkup",
    doctor: "Dr. Johnson"
  }
];

const RecipientDashboard = ({ onActionSuccess }: RecipientDashboardProps) => {
  const handleCancelRequest = (requestId: string) => {
    // In a real app, this would cancel the request
    onActionSuccess(`Request ${requestId} cancelled`);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Recipient Dashboard</h1>
      <p className="text-gray-500">
        View and manage your blood requests
      </p>
      
      {/* Status alert for active request */}
      {activeRequests.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Active Blood Request</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your blood request ({activeRequests[0].id}) is being processed. We'll notify you when we find matching donors.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blood/5 to-blood/10 border-blood/20">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg mb-1">New Request</h3>
              <p className="text-sm text-muted-foreground">Request blood donation</p>
            </div>
            <Link to="/request">
              <Button className="btn-blood">
                <FilePlus className="mr-2 h-4 w-4" />
                Request
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg mb-1">Schedule</h3>
              <p className="text-sm text-muted-foreground">View appointments</p>
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg mb-1">Documents</h3>
              <p className="text-sm text-muted-foreground">Medical records</p>
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg mb-1">Find Donors</h3>
              <p className="text-sm text-muted-foreground">Search by location</p>
            </div>
            <Link to="/donors">
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>My Blood Requests</CardTitle>
              <CardDescription>View and track your active blood requests</CardDescription>
            </CardHeader>
            <CardContent>
              {activeRequests.length > 0 ? (
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <Card key={request.id} className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">Request {request.id}</h3>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {request.status}
                              </Badge>
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                {request.urgency}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Blood Type:</span>{" "}
                                <span className="font-medium text-blood">{request.bloodGroup}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Units:</span>{" "}
                                <span>{request.units}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Hospital:</span>{" "}
                                <span>{request.hospital}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date:</span>{" "}
                                <span>{request.requestDate}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <span className="text-xs text-muted-foreground bg-green-50 px-2 py-1 rounded">
                                {request.matches} potential donors found in your area
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button 
                              onClick={() => handleCancelRequest(request.id)}
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No Active Requests</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any active blood requests.
                  </p>
                  <Link to="/request">
                    <Button className="btn-blood">Create New Request</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>View your past blood requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requestHistory.length > 0 ? (
                <div className="space-y-4">
                  {requestHistory.map((request) => (
                    <Card key={request.id} className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">Request {request.id}</h3>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {request.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Blood Type:</span>{" "}
                                <span className="font-medium text-blood">{request.bloodGroup}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Units:</span>{" "}
                                <span>{request.units}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Hospital:</span>{" "}
                                <span>{request.hospital}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Requested:</span>{" "}
                                <span>{request.requestDate}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Fulfilled:</span>{" "}
                                <span>{request.fulfillmentDate}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Donor:</span>{" "}
                                <span>{request.donorName}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  You have no past blood requests.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{appointment.purpose}</h3>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                Upcoming
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Hospital:</span>{" "}
                                <span>{appointment.hospital}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Doctor:</span>{" "}
                                <span>{appointment.doctor}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date:</span>{" "}
                                <span>{appointment.date}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Time:</span>{" "}
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4 md:mt-0">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any scheduled appointments.
                  </p>
                  <Button className="btn-blood">Schedule Appointment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipientDashboard;
