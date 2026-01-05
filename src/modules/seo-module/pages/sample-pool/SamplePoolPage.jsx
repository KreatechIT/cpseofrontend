import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSamples } from "../../services/samplePoolService";
import { PageHeading } from "@/components/shared/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton";
import SamplePoolFilters from "../../components/sample-pool/SamplePoolFilters";

const SamplePoolPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { samples } = useSelector((state) => state.samplePool);
  const loading = !samples;

  useEffect(() => {
    if (user?.organisation_id && !samples) {
      getAllSamples(dispatch);
    }
  }, [dispatch, user?.organisation_id, samples]);

  return (
    <>
      <title>Sample Pool - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Sample Pool" />

        {loading ? (
          <TableSkeleton />
        ) : (
          <SamplePoolFilters samples={samples} />
        )}
      </main>
    </>
  );
};

export default SamplePoolPage;