import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { House, Plane, PlusIcon, TriangleAlert } from "lucide-react";

import { Progress } from "@/components/ui/progress";

export default function SavingsPlan() {
  return (
    <Card className="shadow-none mt-6">
      <CardHeader>
        <div className="flex items-center justify-between -mt-1">
          <CardTitle>Savings Plan</CardTitle>
          <div className="flex gap-3">
            <div>
              <Button variant="outline" className="text-sm border-0">
                <PlusIcon className="scale-75" /> Add Plan
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 -mt-4">
        <Card className="shadow-none py-3">
          <CardHeader className="px-3">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center ">
                <TriangleAlert className="stroke-primary-accent" />
              </div>
              <CardTitle className="font-normal">Emergency Fund</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-3 -mt-4">
            <Progress value={50} />
            <div className="flex justify-between font-medium text-sm mt-2">
              <p>
                $5,000 <span className="font-light text-xs">50%</span>
              </p>
              <p>Target: $10,000</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none py-3 mt-4">
          <CardHeader className="px-3">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center ">
                <Plane className="stroke-primary-accent" />
              </div>
              <CardTitle className="font-normal">Vacation Fund</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-3  -mt-4">
            <Progress value={60} />
            <div className="flex justify-between font-medium text-sm mt-2">
              <p>
                $3,000 <span className="font-light text-xs">60%</span>
              </p>
              <p>Target: $5,000</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none py-3 mt-4">
          <CardHeader className="px-3">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center ">
                <House className="stroke-primary-accent" />
              </div>
              <CardTitle className="font-normal">Home Down Payment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-3  -mt-4">
            <Progress value={36.25} />
            <div className="flex justify-between font-medium text-sm mt-2">
              <p>
                $7,250 <span className="font-light text-xs">36.25%</span>
              </p>
              <p>Target: $20,000</p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
