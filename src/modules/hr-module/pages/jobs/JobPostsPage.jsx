import usePermission from "@/hooks/usePermission";
import { useDispatch, useSelector } from "react-redux";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { CardSkeletons } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { getAllJobPosts } from "@/modules/hr-module/services/jobsService";
import JobPostFilters from "@/modules/hr-module/components/jobs/JobPostFilters";

const JobPostingsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { jobPosts } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (!jobPosts) getAllJobPosts(user?.organisation_id, dispatch);
  }, []);

  const getJobsFilteredData = (fromDate, toDate) => {
    getAllJobPosts(user.organisation_id, dispatch, fromDate, toDate);
  };

  return (
    <>
      <title>Job Posts - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Job Posts" withCardTableView={true} />
          <div className="">
            {hasPermission("hr_job_posting.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addNewJobPosting",
                      styles:
                        "md:min-w-[750px] lg:min-w-[850px] xl:min-w-[1050px]",
                    })
                  );
                }}
              >
                New Job Posting <Plus />
              </Button>
            )}
          </div>
        </div>

        {jobPosts ? (
          <JobPostFilters jobPosts={jobPosts} onFilter={getJobsFilteredData} />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default JobPostingsPage;
