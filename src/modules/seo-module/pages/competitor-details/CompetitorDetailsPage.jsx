import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompetitors } from "../../services/competitorDetailsService";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TableSkeleton } from "@/components/ui/skeleton";
import CompetitorDetailsFilters from "../../components/competitor-details/CompetitorDetailsFilters";

const CompetitorDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  // Safely get competitors – fallback to empty array if undefined/null/not array
  const competitors = useSelector((state) => {
    const comp = state.competitorDetails?.competitors;
    return Array.isArray(comp) ? comp : [];
  });

  const loading = !competitors.length && !user?.organisation_id; // more accurate loading

  useEffect(() => {
    if (user?.organisation_id) {
      getAllCompetitors(dispatch);
    }
  }, [dispatch, user?.organisation_id]);

  const handleAddCompetitor = () => {
    navigate("/seo/competitor/competitor-details/add");
  };

  return (
    <>
      <title>Competitor Details - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <PageHeading pageTitle="Competitor Details" />
          <Button onClick={handleAddCompetitor}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Competitor
          </Button>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <CompetitorDetailsFilters competitors={competitors} />
        )}
      </main>
    </>
  );
};

export default CompetitorDetailsPage;
