
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue 
}: StatCardProps) => {
  return (
    <Card className="card-gradient shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value}</h4>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={`text-sm font-medium ${
                    trend === "up"
                      ? "text-emerald-600"
                      : trend === "down"
                      ? "text-blood"
                      : "text-gray-500"
                  }`}
                >
                  {trendValue}
                </span>
                {trend === "up" && (
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
                {trend === "down" && (
                  <svg
                    className="w-4 h-4 text-blood"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
          <div className="p-2 bg-blood/10 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
