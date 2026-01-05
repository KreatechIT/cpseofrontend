import { PageHeading } from "@/components/shared/PageHeading";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import DashboardSummaryCards from "../../components/dashboard/HiringDashboardPieChart";
import ApplicantChart from "../../components/dashboard/ApplicantsChart";
import JobsOpenTable from "../../components/dashboard/JobsOpenTable";

const HiringManagementDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const from = queryParams.get("from");
  useEffect(() => {
    if (from === "hr") {
      toast("Welcome to Hiring Management.");
    }
  }, [from]);

  return (
    <>
      <title>Hiring Management - Core360</title>

      <main className="@container mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <PageHeading
            pageTitle="Hiring Management"
            withCardTableView={false}
          />
        </div>

        <DashboardSummaryCards />

        <div className="my-4">
          <ApplicantChart />
        </div>

        <JobsOpenTable />
      </main>
    </>
  );
};

export default HiringManagementDashboard;
