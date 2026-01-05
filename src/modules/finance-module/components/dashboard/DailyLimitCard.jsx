import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils/cn";

export default function DailyLimitCard({ variant = "dashbaord" }) {
  return (
    <Card
      className={cn(
        "shadow-none mt-6",
        variant === "reports" && "w-full mt-0 max-w-100"
      )}
    >
      <CardHeader>
        <CardTitle>Daily Limit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between font-medium text-sm mb-2">
          <p>
            $2,500 <span className="font-light text-xs">spent of $20,0000</span>
          </p>
          <p>12.5%</p>
        </div>
        <Progress
          value={12.5}
          className={cn("", variant === "reports" && "h-14 rounded-md mt-8")}
        />
      </CardContent>
    </Card>
  );
}
