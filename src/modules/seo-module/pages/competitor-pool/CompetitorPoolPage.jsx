import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompetitors } from "../../services/competitorPoolService";
import { PageHeading } from "@/components/shared/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton";
import CompetitorPoolFilters from "../../components/competitor-pool/CompetitorPoolFilters";

const CompetitorPoolPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Safely get competitors from Redux – always return array
  const competitors = useSelector((state) => {
    const comp = state.competitorPool?.competitors;
    return Array.isArray(comp) ? comp : []; // ← This line fixes the error
  });

  const loading = !competitors.length && !user?.organisation_id; // Better loading condition

  useEffect(() => {
    if (user?.organisation_id) {
      getAllCompetitors(dispatch);
    }
  }, [dispatch, user?.organisation_id]);

  return (
    <>
      <title>Competitor Pool - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Competitor Pool" />

        {loading ? (
          <TableSkeleton />
        ) : (
          <CompetitorPoolFilters competitors={competitors} />
        )}
      </main>
    </>
  );
};

export default CompetitorPoolPage;
