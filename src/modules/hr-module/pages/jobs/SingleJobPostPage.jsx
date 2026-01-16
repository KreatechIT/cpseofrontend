import { useDispatch, useSelector } from "react-redux";
import { PageHeading } from "@/components/shared/PageHeading";
import { useEffect } from "react";
import { getAllJobPosts } from "@/modules/hr-module/services/jobsService";
import { getCandidatesByJobPost } from "@/modules/hr-module/services/candidatesService";
import { useParams } from "react-router-dom";
import SingleJobPostFilters from "@/modules/hr-module/components/jobs/SingleJobPostFilters";

const SignleJobPostPage = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { jobPosts } = useSelector((state) => state.jobs);
  const { jobCadidatesByPost } = useSelector((state) => state.candidates);

  useEffect(() => {
    if (!jobPosts) getAllJobPosts(user?.organisation_id, dispatch);
    if (!jobCadidatesByPost[jobId])
      getCandidatesByJobPost(user?.organisation_id, dispatch, jobId);
  }, []);

  const getCandidatesFilteredData = (fromDate, toDate) => {
    getCandidatesByJobPost(
      user.organisation_id,
      dispatch,
      jobId,
      fromDate,
      toDate
    );
  };

  const jobPost = jobPosts?.find((job) => job.id === jobId);
  const jobCandidates = jobCadidatesByPost[jobId] || null;

  return (
    <>
      <title>Job Details - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <PageHeading withCardTableView={false}>
          <span>{jobPost?.job_title}</span>
        </PageHeading>

        {jobPost && jobCandidates && (
          <SingleJobPostFilters
            jobPost={jobPost}
            jobCandidates={jobCandidates}
            onFilter={getCandidatesFilteredData}
          />
        )}
      </main>
    </>
  );
};

export default SignleJobPostPage;
