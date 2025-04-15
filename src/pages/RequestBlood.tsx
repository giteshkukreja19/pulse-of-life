
import RequestForm from "@/components/blood/RequestForm";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Info } from "lucide-react";

const RequestBlood = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">Request Blood Donation</h1>
          <p className="text-gray-500 mb-8 text-center">
            Fill out the form below to submit a blood donation request
          </p>
          
          <Card className="mb-8 border-blood/20">
            <CardHeader className="bg-blood/5">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blood" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p>
                  Please provide accurate information to help us match you with appropriate donors.
                  All requests are verified for authenticity before being processed.
                </p>
                <div className="flex items-center gap-2 text-blood font-medium">
                  <Heart className="h-4 w-4" />
                  <span>Your request will be visible to nearby donors with matching blood type</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <RequestForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestBlood;
