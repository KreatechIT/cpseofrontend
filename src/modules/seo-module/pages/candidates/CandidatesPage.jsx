import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobPosts } from "@/modules/hr-module/services/jobsService";
import { getAllCandidates } from "@/modules/hr-module/services/candidatesService";
import { PageHeading } from "@/components/shared/PageHeading";
import CandidatesFilters from "@/modules/hr-module/components/candidates/CandidatesFilters";
import { CardSkeletons } from "@/components/ui/skeleton";

const CandidatesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobPosts } = useSelector((state) => state.jobs);
  const { allCandidates } = useSelector((state) => state.candidates);

  useEffect(() => {
    if (!allCandidates) getAllCandidates(user?.organisation_id, dispatch);
    if (!jobPosts) getAllJobPosts(user?.organisation_id, dispatch);
  }, []);

  const getCandidatesFilteredData = (
    fromDate,
    toDate,
    jobPostingId,
    status
  ) => {
    getAllCandidates(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      jobPostingId,
      status
    );
  };

  return (
    <>
      <title>Candidates - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Candidates" withCardTableView={true} />
          <div className=""></div>
        </div>

        {allCandidates && jobPosts ? (
          <CandidatesFilters
            candidates={allCandidates}
            jobPosts={jobPosts}
            onFilter={getCandidatesFilteredData}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default CandidatesPage;
