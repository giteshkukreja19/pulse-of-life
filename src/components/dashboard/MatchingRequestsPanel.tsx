
import { useEffect, useState, useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplet, Bell, MapPin } from "lucide-react";
import { useBloodRequests } from "@/hooks/useBloodRequests";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";

interface DonorProfile {
  id: string;
  blood_group: string;
  location: string;
}

const MatchingRequestsPanel = () => {
  const { toast } = useToast();
  const { userId } = useContext(AuthContext);
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch the donor profile to get blood group and location
  useEffect(() => {
    const fetchDonorProfile = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('donors')
          .select('id, blood_group, location')
          .eq('user_id', userId)
          .single();
          
        if (error) throw error;
        setDonorProfile(data);
      } catch (error) {
        console.error("Error fetching donor profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonorProfile();
    
    // Listen for real-time updates on the donors table
    const donorsChannel = supabase
      .channel('donors-profile-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'donors', filter: `user_id=eq.${userId}` },
        fetchDonorProfile
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(donorsChannel);
    };
  }, [userId]);
  
  // Fetch blood requests matching the donor's blood group and location
  const { data: matchingRequests = [], isLoading: isLoadingRequests } = useBloodRequests(
    donorProfile ? {
      bloodGroup: donorProfile.blood_group,
      status: 'pending'
    } : undefined
  );
  
  // Set up real-time subscription for new blood requests
  useEffect(() => {
    if (!donorProfile?.blood_group) return;
    
    // Subscribe to new matching blood requests
    const bloodRequestsChannel = supabase
      .channel('matching-blood-requests')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'blood_requests',
          filter: `blood_group=eq.${donorProfile.blood_group}`
        },
        (payload) => {
          if (payload.new.location === donorProfile.location) {
            // Show notification for local requests
            toast({
              title: "Urgent Blood Request Nearby!",
              description: `A patient in your area needs ${payload.new.blood_group} blood. Can you help?`,
              variant: "default",
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(bloodRequestsChannel);
    };
  }, [donorProfile, toast]);
  
  // Filter local requests (same postal code)
  const localRequests = matchingRequests.filter(req => 
    req.location === donorProfile?.location
  );
  
  // Filter other matching requests (different postal code)
  const otherMatchingRequests = matchingRequests.filter(req => 
    req.location !== donorProfile?.location
  );
  
  if (loading || isLoadingRequests) {
    return <div>Loading matching requests...</div>;
  }
  
  if (!donorProfile) {
    return <div>Please complete your donor profile to see matching requests.</div>;
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blood" />
          Matching Blood Requests
        </CardTitle>
        <CardDescription>
          Blood requests matching your blood type ({donorProfile.blood_group})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {localRequests.length === 0 && otherMatchingRequests.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No matching blood requests at this time. Thank you for your willingness to help!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {localRequests.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blood" />
                  Urgent Requests In Your Area
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.patient_name}</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">{request.blood_group}</Badge>
                        </TableCell>
                        <TableCell>{request.units}</TableCell>
                        <TableCell>{request.hospital}</TableCell>
                        <TableCell>
                          <Badge className={
                            request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                            request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {request.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="text-blood border-blood hover:bg-blood/10">
                            Respond
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {otherMatchingRequests.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-3">Other Matching Requests</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {otherMatchingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.patient_name}</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">{request.blood_group}</Badge>
                        </TableCell>
                        <TableCell>{request.units}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>{request.hospital}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="text-blood border-blood hover:bg-blood/10">
                            Respond
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchingRequestsPanel;
