import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobPosts } from "@/modules/hr-module/services/jobsService";
import { getAllCandidates } from "@/modules/hr-module/services/candidatesService";
import { PageHeading } from "@/components/shared/PageHeading";
import CandidatesFilters from "@/modules/hr-module/components/candidates/CandidatesFilters";
import { CardSkeletons } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { setDialogData } from "@/store/reducers/dialogSlice";

const WhitelistPoolPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobPosts } = useSelector((state) => state.jobs);
  const { allCandidates } = useSelector((state) => state.candidates);

  useEffect(() => {
    if (!allCandidates) getAllCandidates(user?.organisation_id, dispatch);
    if (!jobPosts) getAllJobPosts(user?.organisation_id, dispatch);
  }, []);

  const getCandidatesFilteredData = (fromDate, toDate, jobPostingId) => {
    getAllCandidates(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      jobPostingId
    );
  };

  const whitelistCandidates = allCandidates?.filter((c) => c.is_whitelisted);

  return (
    <>
      <title>Whitelist Pool - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Whitelist Talent" withCardTableView={true} />
          <div className="">
            <Button
              onClick={() =>
                dispatch(
                  setDialogData({
                    type: "addToWhitelistPool",
                    styles:
                      "md:min-w-[750px] lg:min-w-[850px] xl:min-w-[1100px]",
                  })
                )
              }
            >
              Add to Whitelist Pool
            </Button>
          </div>
        </div>

        {whitelistCandidates && jobPosts ? (
          <CandidatesFilters
            candidates={whitelistCandidates}
            jobPosts={jobPosts}
            onFilter={getCandidatesFilteredData}
            page="talent-pool"
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default WhitelistPoolPage;
