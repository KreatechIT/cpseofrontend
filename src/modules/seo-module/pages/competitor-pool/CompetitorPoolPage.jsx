import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompetitors } from "../../services/competitorPoolService";
import { PageHeading } from "@/components/shared/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton";
import CompetitorPoolFilters from "../../components/competitor-pool/CompetitorPoolFilters";

const CompetitorPoolPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { competitors } = useSelector((state) => state.competitorPool);
  const loading = !competitors;

  useEffect(() => {
    if (user?.organisation_id && !competitors) {
      getAllCompetitors(dispatch);
    }
  }, [dispatch, user?.organisation_id, competitors]);

  return (
    <>
      <title>Competitor Pool - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Competitor Pool" />

        {loading ? (
          <TableSkeleton />
        ) : (
          <CompetitorPoolFilters competitors={competitors || []} />
        )}
      </main>
    </>
  );
};

export default CompetitorPoolPage;
