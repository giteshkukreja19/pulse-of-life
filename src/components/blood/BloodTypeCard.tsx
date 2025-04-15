
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BloodTypeCardProps {
  type: string;
  availability: "high" | "medium" | "low";
  canDonateTo: string[];
  canReceiveFrom: string[];
}

const BloodTypeCard = ({
  type,
  availability,
  canDonateTo,
  canReceiveFrom,
}: BloodTypeCardProps) => {
  return (
    <Card className={`overflow-hidden ${
      availability === "low" 
        ? "border-red-300" 
        : availability === "medium" 
          ? "border-amber-300" 
          : "border-emerald-300"
    }`}>
      <div className={`h-2 ${
        availability === "low" 
          ? "bg-red-500" 
          : availability === "medium" 
            ? "bg-amber-500" 
            : "bg-emerald-500"
      }`}></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold">{type}</h3>
            <Badge 
              className={`mt-2 ${
                availability === "low" 
                  ? "bg-red-100 text-red-800 hover:bg-red-100" 
                  : availability === "medium" 
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
              }`}>
              {availability === "low" 
                ? "Low Availability" 
                : availability === "medium" 
                  ? "Medium Availability" 
                  : "High Availability"}
            </Badge>
          </div>
          <div className="h-14 w-14 rounded-full bg-blood flex items-center justify-center">
            <span className="text-white font-bold text-xl">{type}</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Can donate to:</h4>
            <div className="flex flex-wrap gap-1">
              {canDonateTo.map((bloodType) => (
                <Badge key={bloodType} variant="outline" className="bg-gray-100 font-medium">
                  {bloodType}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Can receive from:</h4>
            <div className="flex flex-wrap gap-1">
              {canReceiveFrom.map((bloodType) => (
                <Badge key={bloodType} variant="outline" className="bg-gray-100 font-medium">
                  {bloodType}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodTypeCard;
