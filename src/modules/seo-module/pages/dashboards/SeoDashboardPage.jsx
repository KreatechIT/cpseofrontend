import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCpUpdates, getCpNews } from "../../services/seoDashboardService";
import { PageHeading } from "@/components/shared/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton";
import CpMilestone from "../../components/dashboard/CpMilestone";
import CpUpdates from "../../components/dashboard/CpUpdates";
import CpNews from "../../components/dashboard/CpNews";

const SeoDashboardPage = () => {
  const dispatch = useDispatch();
  const { cpUpdates, cpNews, loading } = useSelector((state) => state.seoDashboard);

  useEffect(() => {
    getCpUpdates(dispatch);
    getCpNews(dispatch);
  }, [dispatch]);

  return (
    <>
      <title>SEO Dashboard - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Dashboard" />

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <CpMilestone />
            <CpUpdates updates={cpUpdates || []} />
            <CpNews news={cpNews || []} />
          </div>
        )}
      </main>
    </>
  );
};

export default SeoDashboardPage;