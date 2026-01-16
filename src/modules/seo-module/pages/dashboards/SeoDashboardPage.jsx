import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../services/seoDashboardService";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CpMilestone from "../../components/dashboard/CpMilestone";
import CpUpdates from "../../components/dashboard/CpUpdates";
import CpNews from "../../components/dashboard/CpNews";
import PerformanceOverview from "../../components/dashboard/PerformanceOverview";
import CpMilestonesTable from "../../components/dashboard/CpMilestonesTable";
import { TableSkeleton } from "@/components/ui/skeleton";

const SeoDashboardPage = () => {
  const dispatch = useDispatch();
  const { overview, cpUpdates, cpNews, milestones, loading } = useSelector(
    (state) => state.seoDashboard
  );

  const [dateRange, setDateRange] = useState({ from: null, to: null });

  useEffect(() => {
    fetchDashboardData(dispatch);
  }, [dispatch]);

  const handleQuickFilter = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    setDateRange({ from, to });
    // You can refetch with params here if needed
  };

  return (
    <>
      <title>SEO Dashboard - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <PageHeading pageTitle="Dashboard" />
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CpMilestone overview={overview} />
              <CpUpdates updates={cpUpdates} />
              <CpNews news={cpNews} />
            </div>

            <div className="mt-8">
              <PageHeading pageTitle="Project Performance" className="mb-4" />
              <br />
              <PerformanceOverview overview={overview} />
            </div>

            <div className="mt-8">
              <CpMilestonesTable milestones={milestones} />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default SeoDashboardPage;