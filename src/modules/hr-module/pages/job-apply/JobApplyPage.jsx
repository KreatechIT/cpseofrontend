import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicJobPost } from "@/modules/hr-module/services/jobsService";
import ThemeToggle from "@/components/themes/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import JobDetailsView from "@/modules/hr-module/components/job-apply/JobDetailsView";
import JobApplicationForm from "@/modules/hr-module/components/job-apply/JobApplicationForm";
import { SuccessIcon } from "@/components/icons/Icons";

const JobApplyPage = () => {
  const { job_id } = useParams();

  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isAppliedSuccessfully, setIsAppliedSuccessfully] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getPublicJobPost(job_id);
        setJobDetail(data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("Job not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (job_id) {
      fetchJob();
    }
  }, [job_id]);

  return (
    <div className="dark:bg-[#111111] min-h-screen">
      <title>Jobs - Core360</title>

      <header className="border-b px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 rounded-full border border-black/10">
              <AvatarImage
                src={jobDetail?.company_logo}
                alt={jobDetail?.company}
                className="h-full w-full rounded-full object-cover border"
              />

              <AvatarFallback className="dark:bg-white/10">
                {jobDetail?.company[0]}
              </AvatarFallback>
            </Avatar>

            <h2 className="font-medium">{jobDetail?.company}</h2>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="mt-4 flex h-full flex-col p-6 max-w-6xl mx-auto text-sm">
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && jobDetail && (
          <>
            {isApplying ? (
              isAppliedSuccessfully ? (
                <div className="text-center">
                  <div className="flex justify-center">
                    <SuccessIcon className="size-16 mb-2" />
                  </div>
                  <h2 className="text-2xl font-semibold">
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-base mt-2 font-medium">
                    Thank you for applying!
                  </p>
                  <p className="text-sm mt-2 max-w-lg mx-auto">
                    We’ve received your application and our team will review it
                    shortly. If your profile matches our requirements, we’ll be
                    in touch with you soon.
                  </p>
                </div>
              ) : (
                <JobApplicationForm
                  job_link_id={job_id}
                  setIsAppliedSuccessfully={setIsAppliedSuccessfully}
                  companyName={jobDetail.company}
                />
              )
            ) : (
              <JobDetailsView
                jobDetail={jobDetail}
                setIsApplying={setIsApplying}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default JobApplyPage;
