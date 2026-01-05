import { EmployeesIcon } from "@/components/icons/HrIcons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { PageHeading } from "@/components/shared/PageHeading";
import RecentActivity from "../../components/dashboard/RecentActivity";
import EmployeeMovementChart from "@/modules/hr-module/components/dashboard/EmployeeMovementChart";
import EmployeeStatusTable from "@/modules/hr-module/components/dashboard/EmployeeStatusTable";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const HrDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const from = queryParams.get("from");
  useEffect(() => {
    if (from === "uam" || from === "finance" || from === "hiring") {
      toast("Welcome to HR Management.");
    }
  }, [from]);

  return (
    <>
      <title>HR Management - Core360</title>

      <main className="@container mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="HR Management" withCardTableView={false} />
        </div>

        <section className="mt-4 flex flex-col gap-4 @3xl:flex-row mb-4">
          <div className="@container w-full flex-grow">
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-none">
                <CardTitle className="flex justify-between px-4">
                  <p className="text-primary text-xl">Total Employees</p>
                  <EmployeesIcon className="fill-primary" />
                </CardTitle>
                <CardContent className="flex flex-col items-start justify-center py-5">
                  <p className="text-foreground text-5xl font-bold">500</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Decrease from last month
                  </p>
                  <Badge className="rounded-full bg-red-200 text-red-800">
                    <TrendingDownIcon /> -7.78%
                  </Badge>
                </CardFooter>
              </Card>

              <Card className="shadow-none">
                <CardTitle className="flex justify-between px-4">
                  <p className="text-emerald-500 text-xl">New Employees</p>
                  <EmployeesIcon className="fill-emerald-500" />
                </CardTitle>
                <CardContent className="flex flex-col items-start justify-center py-5">
                  <p className="text-foreground text-5xl font-bold">15</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Increase from last month
                  </p>
                  <Badge className="rounded-full bg-emerald-100 text-emerald-800">
                    <TrendingUpIcon /> +1.24%
                  </Badge>
                </CardFooter>
              </Card>

              <Card className="shadow-none">
                <CardTitle className="flex justify-between px-4">
                  <p className="text-destructive text-xl">Total Employees</p>
                  <EmployeesIcon className="fill-destructive" />
                </CardTitle>
                <CardContent className="items-start justify-center grid grid-cols-[200px_1fr] gap-2">
                  <p className="text-muted-foreground text-sm">
                    Voluntary turnovers
                  </p>
                  <p className="text-destructive text-end">5</p>
                  <p className="text-muted-foreground text-sm">
                    Involuntary turnovers
                  </p>
                  <p className="text-destructive text-end">5</p>
                  <p className="text-foreground">Total turnover this month</p>
                  <p className=" text-end font-bold text-xl">10</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Decrease from last month
                  </p>
                  <Badge className="rounded-full bg-red-200 text-red-800">
                    <TrendingDownIcon /> -7.78%
                  </Badge>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="w-full shrink-0 space-y-4 @xl:w-80 @7xl:w-100 hidden @6xl:block">
            <RecentActivity className=" @xl:h-50 @7xl:h-48" />
          </div>
        </section>

        <div className="mb-4">
          <EmployeeMovementChart />
        </div>

        <EmployeeStatusTable />
      </main>
    </>
  );
};

export default HrDashboard;
